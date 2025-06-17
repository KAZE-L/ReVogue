from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import google.generativeai as genai
# 重要：導入我們修改後的協作工作流
from app.agents.collaboration_workflow import app as collaboration_app, CollaborationState, DiscussionEntry
from typing import List, Dict, Optional # For type hinting
from pydantic import Field # For examples in Pydantic models

# 配置日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# 檢查 API key
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    logger.error("GOOGLE_API_KEY not found in environment variables")
    raise ValueError("GOOGLE_API_KEY is required")

try:
    # 配置 Google API
    genai.configure(api_key=api_key)
    logger.info("Successfully configured Google Generative AI")
except Exception as e:
    logger.error(f"Failed to configure Google Generative AI: {str(e)}")
    raise

app = FastAPI(
    title="ReVogue Styling Collaboration API",
    description="API for generating fashion style suggestions through multi-agent collaboration.",
    version="0.1.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 在生產環境中，應指定允許的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserStyleRequest(BaseModel):
    user_request: str = Field(..., example="我下週有一個商務休閒活動，希望看起來專業但又平易近人。", description="用戶的風格請求描述")

class CollaborationResponse(BaseModel):
    user_request: str = Field(..., description="用戶原始請求")
    discussion_log: List[DiscussionEntry] = Field(..., description="詳細的討論記錄，包含每個發言者的訊息")
    final_recommendation: str = Field(..., description="最終生成的風格建議文案")
    current_proposal: Dict = Field(..., description="最終確認的提案項目字典")
    consensus_reached: bool = Field(..., description="是否所有代理達成共識")
    round_number: int = Field(..., description="總共進行的討論回合數")
    error_message: Optional[str] = Field(None, description="流程中發生的錯誤訊息")

@app.post("/get_style_suggestion", 
            response_model=CollaborationResponse, 
            summary="獲取風格建議",
            description="接收用戶風格請求，透過多Agent協作流程生成建議，並返回包含討論過程的詳細結果。")
async def get_style_suggestion_endpoint(request: UserStyleRequest):
    logger.info(f"Received style request: {request.user_request}")
    try:
        inputs = {"user_request": request.user_request}
        # LangGraph app.invoke() 是同步的。如果Agent調用LLM時間較長，考慮使用 app.ainvoke() 並將此端點改為異步。
        # final_state: CollaborationState = await collaboration_app.ainvoke(inputs)
        final_state: CollaborationState = collaboration_app.invoke(inputs)

        response_data = CollaborationResponse(
            user_request=final_state.get("user_request", "未能獲取用戶請求"),
            discussion_log=final_state.get("discussion_log", []),
            final_recommendation=final_state.get("final_recommendation", "未能生成最終建議。"),
            current_proposal=final_state.get("current_proposal", {}),
            consensus_reached=final_state.get("consensus_reached", False),
            round_number=final_state.get("round_number", 0),
            error_message=final_state.get("error_message")
        )
        return response_data
    except Exception as e:
        logger.error(f"Error processing style suggestion for request '{request.user_request}': {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"處理您的風格建議請求時發生內部錯誤。錯誤詳情: {str(e)}")

@app.get("/", summary="API 根目錄", description="檢查 API 是否正常運行")
async def read_root():
    return {"message": "Welcome to the ReVogue Styling Collaboration API! Visit /docs for API documentation."}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 