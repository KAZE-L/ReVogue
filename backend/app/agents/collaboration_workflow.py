from typing import List, Dict, TypedDict, Annotated, Literal
import operator
import os # For API Key

# --- IMPORTANT: GOOGLE API KEY CONFIGURATION ---
# Make sure your GOOGLE_API_KEY environment variable is set.
# Alternatively, you can configure it directly in your code (less secure):
# import google.generativeai as genai
# genai.configure(api_key="YOUR_GOOGLE_API_KEY")
# It's recommended to call genai.configure() once at the start of your application.
# For this workflow, ensure it's configured before any genai.GenerativeModel() call.
# ----------------------------------------------

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage # Assuming you'll use Langchain messages
from langgraph.graph import StateGraph, END, START
# from langgraph.checkpoint.sqlite import SqliteSaver # Example for persistence - Commented out to resolve ModuleNotFoundError

# Assuming your existing agents might have a structure like this, adjust as needed
# from .trend_analyst import TrendAnalyst  # Example import
# from .color_analyst import ColorAnalyst  # Example import
# from .encourager import Encourager    # Example import

# Assuming google.generativeai is configured elsewhere (e.g., with API key)
import google.generativeai as genai

# Placeholder for a generic model, initialize as needed, perhaps in a shared config
# For now, we'll assume agent models can be used or a default one is available.
# We will instantiate specific agent models within their nodes.

# Import your actual agent classes
from .trend_analyst import TrendAnalyst
from .color_analyst import ColorAnalyst
from .encourager import Encourager

# Helper class for structured discussion log entries
class DiscussionEntry(TypedDict):
    speaker: str
    message: str

# Helper function to format discussion log for LLM context
def format_discussion_log_for_llm(log: List[DiscussionEntry]) -> str:
    if not log:
        return "目前沒有討論記錄。"
    return "\n".join([f"{entry['speaker']}: {entry['message']}" for entry in log])

# Helper function to parse LLM response for feedback and vote (very basic)
def parse_agent_response(response_text: str) -> (str, Literal["同意", "不同意", "棄權"]):
    feedback = response_text
    vote = "棄權" # Default to abstain if not clearly stated
    if "不同意" in response_text:
        vote = "不同意"
    elif "同意" in response_text: # Check for 同意 after 不同意 to catch specific phrases
        vote = "同意"
    
    # Crude way to separate vote from feedback if it's appended
    # E.g., "This is great. Vote: 同意"
    for v_str in ["Vote: 同意", "Vote: 不同意", "Vote: 棄權"]:
        if v_str in feedback:
            feedback = feedback.replace(v_str, "").strip()
            break
    return feedback, vote

# Generic LLM call function (placeholder)
def generate_with_llm(system_prompt: str, user_prompt: str, model_instance=None) -> str:
    print(f"\n--- Generic LLM Call ---")
    print(f"System: {system_prompt}")
    print(f"User: {user_prompt}")
    if model_instance is None:
        # Fallback to a default model if none provided - CONFIGURE THIS!
        try:
            model_instance = genai.GenerativeModel("gemini-1.5-flash-latest") 
        except Exception as e:
            print(f"Error initializing default LLM: {e}")
            return "[LLM 初始化錯誤，無法生成回應]"

    try:
        full_prompt = [system_prompt, user_prompt] if system_prompt else [user_prompt]
        response = model_instance.generate_content(full_prompt)
        print(f"LLM Response: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error during LLM generation: {e}")
        return f"[LLM 生成錯誤: {e}]"


class CollaborationState(TypedDict):
    user_request: str
    current_proposal: Dict  # 例如: {"上衣": "T恤", "下著": "牛仔褲", "飾品": "運動鞋", "風格描述": "休閒舒適"}
    discussion_log: Annotated[List[DiscussionEntry], operator.add]
    agent_votes: Dict[str, Literal["同意", "不同意", "棄權"]]
    round_number: int
    consensus_reached: bool
    final_recommendation: str
    # 追蹤錯誤或其他元數據
    error_message: str

# --- Node Functions --- #

def initiate_proposal_node(state: CollaborationState) -> CollaborationState:
    print(f"--- 第 {state.get('round_number', 0)} 回合: 初始提案生成 ---")
    user_request = state["user_request"]
    
    system_prompt = "你是一位時尚造型助理。請根據用戶的請求，生成一個初步的、包含上衣、下著、飾品和風格描述的穿搭提案。提案內容請使用中文。"
    user_prompt = f"用戶請求：'{user_request}'。請提供一個初步的穿搭提案。"
    
    # 使用通用 LLM 生成初始提案
    # 假設有一個通用的 genai.GenerativeModel 實例可用，或者在此處初始化
    # generic_llm = genai.GenerativeModel("gemini-1.5-flash-latest") # Or your preferred model
    # response_text = generate_with_llm(system_prompt, user_prompt, model_instance=generic_llm)
    response_text = generate_with_llm(system_prompt, user_prompt) # Uses default in helper

    # TODO: 更穩健地從 response_text 解析出結構化的提案字典
    # 這裡用一個非常簡化的方式，實際應用中需要更強的解析邏輯或讓 LLM 直接輸出 JSON
    try:
        # 假設 LLM 回覆類似 "上衣：白色T恤，下著：藍色牛仔褲，飾品：運動鞋，風格描述：經典休閒風"
        # 這部分需要非常小心地設計提示和解析
        parts = response_text.split('，')
        proposal_dict = {}
        for part in parts:
            if '：' in part:
                key, value = part.split('：', 1)
                # Map Chinese keys to English keys if your state uses English keys, or keep Chinese
                # For now, let's assume the state will use Chinese keys for proposal items.
                proposal_dict[key.strip()] = value.strip()
        if not proposal_dict or len(proposal_dict) < 2 : # Basic check
             raise ValueError("Failed to parse initial proposal from LLM response")
        initial_proposal = proposal_dict
    except Exception as e:
        print(f"Error parsing initial proposal: {e}. Using fallback.")
        initial_proposal = {"上衣": "白色T恤", "下著": "藍色牛仔褲", "飾品": "運動鞋", "風格描述": "經典休閒風 (備用方案)"}

    print(f"初始提案: {initial_proposal}")
    # Initialize discussion_log as a list if it's the first step
    current_discussion_log = state.get("discussion_log", [])
    current_discussion_log.append(DiscussionEntry(speaker="系統", message=f"已為用戶請求 '{user_request}' 生成初始提案。內容：{initial_proposal}"))
    return {
        "current_proposal": initial_proposal,
        "discussion_log": current_discussion_log,
        "agent_votes": {},
        "round_number": 1,
        "consensus_reached": False
    }

def trend_analyst_node(state: CollaborationState) -> CollaborationState:
    print("--- 潮流分析師發言 ---")
    proposal = state["current_proposal"]
    discussion_log = state["discussion_log"]

    agent = TrendAnalyst() # Instantiate the agent
    system_prompt = agent.get_system_prompt()
    # Construct user prompt for the agent
    recent_discussion_formatted = format_discussion_log_for_llm(discussion_log[-3:]) # Use helper
    user_prompt = (
        f"這是目前的穿搭提案：{proposal}。"
        f"這是目前的討論記錄：\n{recent_discussion_formatted}\n\n"
        f"請根據你的專業知識（潮流趨勢）對此提案發表看法，並明確指出你是 '同意' 還是 '不同意' 這個提案。"
        f"如果不同意，請說明原因並提出改進建議。你的回覆必須包含 '同意' 或 '不同意' 字樣。"
    )

    response_text = generate_with_llm(system_prompt, user_prompt, model_instance=agent.model)
    feedback, vote = parse_agent_response(response_text)
    
    print(f"潮流分析師: {feedback} (投票: {vote})")
    current_votes = state.get("agent_votes", {}).copy()
    current_votes["trend_analyst"] = vote
    # Append to existing discussion log
    current_discussion_log = state.get("discussion_log", [])
    current_discussion_log.append(DiscussionEntry(speaker="潮流分析師 (TrendAnalyst)", message=f"{feedback} (投票: {vote})"))
    return {
        "discussion_log": current_discussion_log,
        "agent_votes": current_votes
    }

def color_analyst_node(state: CollaborationState) -> CollaborationState:
    print("--- 色彩分析師發言 ---")
    proposal = state["current_proposal"]
    discussion_log = state["discussion_log"]

    agent = ColorAnalyst()
    system_prompt = agent.get_system_prompt()
    recent_discussion_formatted = format_discussion_log_for_llm(discussion_log[-3:]) # Use helper
    user_prompt = (
        f"這是目前的穿搭提案：{proposal}。"
        f"這是目前的討論記錄：\n{recent_discussion_formatted}\n\n"
        f"請根據你的專業知識（色彩搭配）對此提案發表看法，並明確指出你是 '同意' 還是 '不同意' 這個提案。"
        f"如果不同意，請說明原因並提出改進建議。你的回覆必須包含 '同意' 或 '不同意' 字樣。"
    )

    response_text = generate_with_llm(system_prompt, user_prompt, model_instance=agent.model)
    feedback, vote = parse_agent_response(response_text)

    print(f"色彩分析師: {feedback} (投票: {vote})")
    current_votes = state.get("agent_votes", {}).copy()
    current_votes["color_analyst"] = vote
    current_discussion_log = state.get("discussion_log", [])
    current_discussion_log.append(DiscussionEntry(speaker="色彩分析師 (ColorAnalyst)", message=f"{feedback} (投票: {vote})"))
    return {
        "discussion_log": current_discussion_log,
        "agent_votes": current_votes
    }

def encourager_node(state: CollaborationState) -> CollaborationState:
    print("--- 鼓勵師/風格協調師發言 ---")
    proposal = state["current_proposal"]
    discussion_log = state["discussion_log"]

    agent = Encourager()
    system_prompt = agent.get_system_prompt()
    recent_discussion_formatted = format_discussion_log_for_llm(discussion_log[-5:]) # Last 5 entries
    proposal_str = ", ".join([f"{k}: {v}" for k, v in proposal.items()])
    
    user_prompt = (f"這是目前的穿搭提案：'{proposal_str}'。\n"
                     f"最近的討論摘要：\n{recent_discussion_formatted}\n\n"
                     f"請根據你的專業角度，對此提案提供具體的意見和建議。你的回覆必須包含明確的投票（'同意' 或 '不同意'）。")

    response_text = generate_with_llm(system_prompt, user_prompt, model_instance=agent.model)
    feedback, vote = parse_agent_response(response_text)
    
    print(f"鼓勵師: {feedback} (投票: {vote})")
    current_votes = state.get("agent_votes", {}).copy()
    current_votes["encourager"] = vote
    current_discussion_log = state.get("discussion_log", []) # Ensure we're working with the log from state
    current_discussion_log.append(DiscussionEntry(speaker="鼓勵師 (Encourager)", message=f"{feedback} (投票: {vote})"))
    return {
        "discussion_log": current_discussion_log,
        "agent_votes": current_votes
    }

AGENT_NAMES = ["trend_analyst", "color_analyst", "encourager"] # Define your agent names

def consensus_check_node(state: CollaborationState) -> CollaborationState:
    print("--- 共識檢查 ---")
    votes = state["agent_votes"]
    discussion = state["discussion_log"]
    current_proposal_str = str(state["current_proposal"]) # Convert dict to string for prompt
    round_num = state["round_number"]

    all_agree = True
    # Ensure all defined agents have voted before checking for disagreement
    if len(votes) < len(AGENT_NAMES):
        print("部分代理尚未投票，等待所有代理完成。") # Should not happen in strict sequential flow
        all_agree = False 
    else:
        for agent_name in AGENT_NAMES:
            if votes.get(agent_name) != "同意":
                all_agree = False
                break

    if all_agree:
        print("已達成共識！")
        state["discussion_log"].append(DiscussionEntry(speaker="系統", message="所有代理已達成共識。"))
        return {"consensus_reached": True}
    else:
        print(f"第 {round_num} 回合未達成共識。綜合意見以修訂提案。")
        
        system_prompt = (
            "你是一位經驗豐富的會議主持人與協調員。你的任務是綜合不同AI專家的意見，以改進一份穿搭提案。"
            "請仔細閱讀目前的提案和所有專家的討論記錄。"
            "然後，生成一個新的、改進後的穿搭提案（包含上衣、下著、飾品和風格描述），旨在解決專家們提出的分歧或擔憂。"
            "新的提案應該更全面、更優秀。請用中文輸出新的提案。"
        )
        user_prompt = (
            f"目前的穿_搭提案：{current_proposal_str}\n\n"
            f"到目前為止的討論記錄：\n{'\n'.join([entry['message'] for entry in discussion])}\n\n"
            f"專家投票情況：{votes}\n\n"
            "請根據以上信息，生成一個改進後的穿搭提案（請嚴格按照上衣、下著、飾品、風格描述的格式，用中文冒號分隔，例如 '上衣：紅色襯衫，下著：黑色長褲...'）。"
        )
        
        # generic_llm = genai.GenerativeModel("gemini-1.5-flash-latest") # Or your preferred model
        # revised_proposal_text = generate_with_llm(system_prompt, user_prompt, model_instance=generic_llm)
        revised_proposal_text = generate_with_llm(system_prompt, user_prompt) # Uses default in helper

        # TODO: 更穩健地從 revised_proposal_text 解析出結構化的提案字典
        try:
            parts = revised_proposal_text.split('，')
            proposal_dict = {}
            for part in parts:
                if '：' in part:
                    key, value = part.split('：', 1)
                    proposal_dict[key.strip()] = value.strip()
            if not proposal_dict or len(proposal_dict) < 2:
                 raise ValueError("Failed to parse revised proposal from LLM response")
            revised_proposal = proposal_dict
            error_msg = None
        except Exception as e:
            print(f"Error parsing revised proposal: {e}. Reusing previous proposal with notes.")
            revised_proposal = state["current_proposal"].copy()
            revised_proposal["風格描述"] = revised_proposal.get("風格描述", "") + f" (第{round_num}回合修訂失敗，保留原案)"
            error_msg = f"解析修訂提案失敗: {e}"

        print(f"修訂後提案: {revised_proposal}")
        state["current_proposal"] = revised_proposal
        state["discussion_log"].append(DiscussionEntry(speaker="系統", message=f"已修訂提案為：{revised_proposal}"))
        return {
            "consensus_reached": False,
            "agent_votes": {}, # 為下一輪重置投票
            "round_number": round_num + 1,
            "error_message": error_msg
        }

def final_output_node(state: CollaborationState) -> CollaborationState:
    print("--- 最終建議生成 ---")
    final_proposal = state["current_proposal"]
    discussion = state["discussion_log"]
    user_request = state["user_request"]

    system_prompt = (
        "你是一位頂級時尚編輯。你的任務是將 AI 專家團隊達成的穿搭共識方案，以及他們的討論過程，整理成一份引人入勝、完整且用戶友好的最終穿搭建議。"
        "你的建議需要包含最終方案的詳細描述，並可以適當引用討論中的亮點，讓用戶感受到這是經過深思熟慮的結果。"
        "請使用親切且專業的中文語氣。"
    )
    recent_discussion_formatted = format_discussion_log_for_llm(discussion[-5:]) # 最後5條討論
    final_proposal_str = ", ".join([f"{k}: {v}" for k, v in final_proposal.items()])
    user_prompt = (
        f"用戶原始請求：'{user_request}'\n\n"
        f"最終達成的穿搭方案：'{final_proposal_str}'\n\n"
        f"相關討論摘要：\n{recent_discussion_formatted}\n\n"
        "請根據以上信息，撰寫一份最終的穿搭建議。"
    )

    # generic_llm = genai.GenerativeModel("gemini-1.5-flash-latest") # Or your preferred model
    # recommendation_text = generate_with_llm(system_prompt, user_prompt, model_instance=generic_llm)
    recommendation_text = generate_with_llm(system_prompt, user_prompt) # Uses default in helper

    print(f"最終建議: {recommendation_text}")
    state["final_recommendation"] = recommendation_text
    state["discussion_log"].append(DiscussionEntry(speaker="系統", message=f"生成最終建議：{recommendation_text[:100]}...")) # Log a snippet
    return state
# --- Conditional Edge Logic --- #

MAX_ROUNDS = 5 # To prevent infinite loops

def should_continue_discussion(state: CollaborationState) -> Literal["continue_discussion", "generate_final_output", "force_end"]:
    if state["consensus_reached"]:
        return "generate_final_output"
    if state["round_number"] > MAX_ROUNDS:
        print(f"已達到最大討論回合數 ({MAX_ROUNDS})。強制結束討論並嘗試生成最終建議。")
        # 即使未達成完全共識，也嘗試生成最終輸出
        # 或者可以導向一個特定的“部分共識”輸出節點
        return "force_end" 
    return "continue_discussion"

# --- Graph Assembly --- #

workflow = StateGraph(CollaborationState)

# Add nodes
workflow.add_node("initiate_proposal", initiate_proposal_node)
workflow.add_node("trend_analyst", trend_analyst_node)
workflow.add_node("color_analyst", color_analyst_node)
workflow.add_node("encourager", encourager_node)
workflow.add_node("consensus_check", consensus_check_node)
workflow.add_node("final_output", final_output_node)

# Define edges
workflow.add_edge(START, "initiate_proposal")

# Option 1: Sequential agent discussion in each round
workflow.add_edge("initiate_proposal", "trend_analyst")
workflow.add_edge("trend_analyst", "color_analyst")
workflow.add_edge("color_analyst", "encourager")
workflow.add_edge("encourager", "consensus_check")

# Option 2: Parallel agent discussion (more complex to set up correctly with standard edges)
# For true parallelism leading to a join node (ConsensusCheckNode), 
# you might need a slightly different structure or rely on how LangGraph handles 
# multiple edges pointing to the same node if they are not conditional.
# A common pattern is to have a list of tasks and fan them out.
# For this example, sequential is simpler to start with.

workflow.add_conditional_edges(
    "consensus_check",
    should_continue_discussion,
    {
        "continue_discussion": "trend_analyst", # Loop back to the start of the agent discussion for the new round
        "generate_final_output": "final_output",
        "force_end": "final_output" # Or a specific error/fallback node
    }
)

workflow.add_edge("final_output", END)

# 編譯圖
# memory = SqliteSaver.from_conn_string(":memory:") # 持久化示例，需要 pip install langgraph[sqlite]
# app = workflow.compile(checkpointer=memory)
app = workflow.compile()

# 確保 AGENT_NAMES 列表中的名稱與 agent_votes 字典中的鍵以及節點名稱（如果用於路由）一致
# 例如，如果 trend_analyst_node 的投票鍵是 "trend_analyst"，則 AGENT_NAMES 應包含 "trend_analyst"

# --- Example Invocation (for testing) --- #
if __name__ == "__main__":
    inputs = {"user_request": "我下週有一個商務休閒活動，希望看起來專業但又平易近人。"}
    # config = {"configurable": {"thread_id": "my-thread-chinese-test-1"}} # 用於持久化
    
    print("啟動協作式穿搭建議流程...")
    # final_state = app.invoke(inputs, config=config)
    final_state = app.invoke(inputs)

    print("\n--- 流程結束 ---")
    print(f"用戶請求: {final_state.get('user_request')}")
    print(f"最終建議:\n{final_state.get('final_recommendation')}")
    print("\n完整討論記錄:")
    if final_state.get('discussion_log'):
      for entry in final_state['discussion_log']:
          print(f"{entry['speaker']}: {entry['message']}")
    print(f"\n總回合數: {final_state.get('round_number')}")
    print(f"是否達成共識: {final_state.get('consensus_reached')}")
    if final_state.get('error_message'):
        print(f"錯誤訊息: {final_state.get('error_message')}")

    # To visualize (optional, requires graphviz)
    # try:
    #     from IPython.display import Image, display
    #     img_data = app.get_graph().draw_mermaid_png()
    #     with open("collaboration_workflow.png", "wb") as f:
    #         f.write(img_data)
    #     print("\nWorkflow graph saved to collaboration_workflow.png")
    #     # display(Image(img_data))
    # except Exception as e:
    #     print(f"Could not generate graph image: {e}")

