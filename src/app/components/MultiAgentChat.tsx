'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const agents = [
  { id: 'agent1', name: 'Agent 1', content: '這是 Agent 1 的思考內容。' },
  { id: 'agent2', name: 'Agent 2', content: '這是 Agent 2 的思考內容。' },
  { id: 'agent3', name: 'Agent 3', content: '這是 Agent 3 的思考內容。' },
  { id: 'agent4', name: 'Agent 4', content: '這是 Agent 4 的思考內容。' },
  { id: 'agent5', name: 'Agent 5', content: '這是 Agent 5 的思考內容。' },
];

const leadAgent = {
  name: 'Main Agent',
  content:
    '綜合以上分析，建議您今日可以選擇清爽風格的穿搭，搭配淺色外套與防水材質的鞋款。',
};

export default function MultiAgentChat() {
  const [showDiscussion, setShowDiscussion] = useState(false);

  return (
    <div className="p-4 space-y-4">

      <div className="border rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <button
            className="text-sm text-gray-600 flex items-center gap-1"
            onClick={() => setShowDiscussion(!showDiscussion)}
          >
            {showDiscussion ? 'hide discussion' : 'show discussion'}
            {showDiscussion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <MessageSquare size={16} className="text-gray-400" />
        </div>

        {showDiscussion && (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">{agent.name}</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {agent.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="text-xs text-gray-500 mb-1">{leadAgent.name}</div>
          <div className="text-sm text-gray-800 whitespace-pre-line">
            {leadAgent.content}
          </div>
        </div>
      </div>
    </div>
  );
}
