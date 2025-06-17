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
    <div className="multiagent-chat-root">

      <div className="multiagent-chat-card">
        <div className="multiagent-chat-toolbar">
          <button
            className="multiagent-chat-toggle"
            onClick={() => setShowDiscussion(!showDiscussion)}
          >
            {showDiscussion ? 'hide discussion' : 'show discussion'}
            {showDiscussion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <MessageSquare size={16} className="multiagent-chat-icon" />
        </div>

        {showDiscussion && (
          <div className="multiagent-chat-discussion">
            {agents.map((agent) => (
              <div key={agent.id} className="multiagent-chat-agent">
                <div className="multiagent-chat-agent-name">{agent.name}</div>
                <div className="multiagent-chat-agent-content">
                  {agent.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="multiagent-chat-lead">
          <div className="multiagent-chat-lead-name">{leadAgent.name}</div>
          <div className="multiagent-chat-lead-content">
            {leadAgent.content}
          </div>
        </div>
      </div>
    </div>
  );
}
