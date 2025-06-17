'use client';

import { useState, useEffect, MouseEventHandler } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';
import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from '@firebase/auth';
import { firebaseConfig } from '../../firebaseConfig'; // Adjust path if necessary

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Matches backend DiscussionEntry
interface DiscussionEntry {
  speaker: string;
  message: string;
}

// Matches backend CollaborationResponse structure for a single turn/result
interface ChatTurn {
  user_request: string; // User's initial request text
  discussion_log: DiscussionEntry[];
  final_recommendation: string;
  current_proposal: Record<string, string>; // e.g., {"上衣": "...", "下著": "..."}
  // Optional: Add other fields from CollaborationResponse if needed for display
  // consensus_reached?: boolean;
  // round_number?: number;
  // error_message?: string | null;
}

export default function Chat() {
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if user is signed in
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Updated to modular SDK User type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/get_style_suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_request: userMessage }),
      });

      if (!response.ok) {
        throw new Error('API 請求失敗');
      }

      const data = await response.json(); 
      // data is expected to be CollaborationResponse from backend
      // { user_request, discussion_log, final_recommendation, current_proposal, ... }
      setChatTurns(prevTurns => [
        ...prevTurns,
        {
          user_request: data.user_request || userMessage, // Use original userMessage as fallback
          discussion_log: data.discussion_log || [],
          final_recommendation: data.final_recommendation || '',
          current_proposal: data.current_proposal || {},
          // consensus_reached: data.consensus_reached,
          // round_number: data.round_number,
          // error_message: data.error_message
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  // 依 agent role 解析表情符號
  // Updated to parse speaker string, which might contain role or full name
  const getAgentEmoji = (speaker: string): { emoji: string; name: string } => {
    // Simple heuristic: try to extract role from strings like "鼓勵師 (Encourager)"
    const roleMatch = speaker.match(/\(([^)]+)\)/); // Extracts content within parentheses
    const extractedRole = roleMatch ? roleMatch[1].toLowerCase().replace(/\s+/g, '_') : speaker.toLowerCase().replace(/\s+/g, '_');

    const agentInfo: { [key: string]: { emoji: string; name: string } } = {
      personal_assistant: { emoji: '🗓️', name: '個人秘書' },
      style_consultant: { emoji: '👩‍🎨', name: '形象顧問' },
      fashion_designer: { emoji: '👗', name: '服裝設計師' },
      color_analyst: { emoji: '🎨', name: '色彩鑑定師' },
      trend_analyst: { emoji: '🔥', name: '潮流分析師' },
      encourager: { emoji: '💬', name: '鼓勵員' },
      user: { emoji: '👤', name: '你' },
    };
    return agentInfo[extractedRole] || { emoji: '🤖', name: speaker }; // Fallback to full speaker name if no specific role match
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      // const user = result.user;
      console.log('Google Sign-In successful', result.user);
      // onAuthStateChanged will handle setting isSignedIn and currentUser
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData?.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Google Sign-In error:', errorCode, errorMessage);
      setError(`登入失敗: ${errorMessage}`);
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      setCurrentUser(user);
      if (user) {
        // User is signed in, get the ID token:
        user.getIdToken().then(function(idToken) {
          console.log('User ID Token:', idToken); // For debugging, send this to backend
          // TODO: Send this token to your backend to verify and create a session
        });
      } else {
        // User is signed out
        console.log('User is signed out');
      }
    });
    return () => unsubscribe(); // Unsubscribe on cleanup
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            ReVogue 智能穿搭顧問
          </h1>
          <div>
            {isSignedIn && currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.photoURL && <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-8 h-8 rounded-full" />}
                <span className="text-sm text-gray-700">{currentUser.displayName || currentUser.email}</span>
                <button 
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      console.log('User signed out successfully');
                    } catch (error) {
                      console.error('Sign out error', error);
                      setError('登出失敗，請稍後再試。');
                    }
                  }} 
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  登出
                </button>
              </div>
            ) : (
              null // Render nothing in the top-right if not signed in, main UI is at the bottom
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="space-y-8 mb-4">
            {chatTurns.map((turn, idx) => (
              <div key={idx} className="space-y-4">
                {/* 用戶提問 */}
                <div className="bg-purple-100 p-4 rounded-lg ml-auto max-w-[80%]">
                  <div className="text-gray-800">
                    <div className="font-medium mb-1">您的需求：</div>
                    <div>{turn.user_request}</div>
                  </div>
                </div>
                {/* AI agents 討論過程 */}
                <div className="bg-pink-50 p-4 rounded-lg space-y-4">
                  <div className="font-medium text-gray-700 mb-2">AI 團隊討論紀錄：</div>
                  <div className="space-y-4">
                    {turn.discussion_log.map((entry, i) => {
                      const { emoji, name } = getAgentEmoji(entry.speaker);
                      return (
                        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                          <div className="flex items-center gap-2 mb-2 text-gray-700">
                            <span className="text-xl">{emoji}</span>
                            <span className="font-medium">{name}</span>
                          </div>
                          <div className="prose prose-sm max-w-none text-gray-800">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.message}</ReactMarkdown>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 最終建議 */}
                  {turn.final_recommendation && (
                    <div className="bg-white rounded-lg p-4 shadow-md border border-purple-200 mt-6">
                      <div className="font-bold text-lg text-purple-800 mb-2">🌟 最終穿搭建議</div>
                      <div className="prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{turn.final_recommendation}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {/* Optional: Display current_proposal details if needed */}
                  {/* Object.keys(turn.current_proposal).length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 mt-4">
                      <div className="font-medium text-gray-700 mb-2">提案細節：</div>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {Object.entries(turn.current_proposal).map(([key, value]) => (
                          <li key={key}><strong>{key}:</strong> {value}</li>
                        ))}
                      </ul>
                    </div>
                  )*/}

                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">AI 正在思考中...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                錯誤：{error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="請描述您的穿搭需求..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              發送
            </button>
          </form>
        </div>

        {!isSignedIn && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">請先登入以開始使用</h2>
            <button
              onClick={handleGoogleSignIn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 focus:outline-none focus:shadow-outline"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56,12.25C22.56,11.47,22.5,10.72,22.38,10H12V14.5H18.37C18.13,15.93,17.35,17.14,16.27,17.89V20.6H19.9C21.62,19,22.56,16.83,22.56,14.12V12.25Z"/><path d="M12,23C14.97,23,17.45,22.04,19.28,20.6L16.27,17.89C15.25,18.6,13.76,19.05,12,19.05C9.08,19.05,6.6,17.09,5.62,14.36H1.93V17.19C3.72,20.77,7.56,23,12,23Z"/><path d="M5.62,14.36C5.38,13.63,5.25,12.83,5.25,12C5.25,11.17,5.38,10.37,5.62,9.64V6.81H1.93C1.08,8.52,0.56,10.19,0.56,12C0.56,13.81,1.08,15.48,1.93,17.19L5.62,14.36Z"/><path d="M12,4.95C13.89,4.95,15.38,5.63,16.22,6.43L19.31,3.34C17.45,1.66,14.97,0.75,12,0.75C7.56,0.75,3.72,3.23,1.93,6.81L5.62,9.64C6.6,6.91,9.08,4.95,12,4.95Z"/></svg>
              使用 Google 帳戶登入
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 