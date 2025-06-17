from abc import ABC, abstractmethod
import google.generativeai as genai

class BaseAgent(ABC):
    """The base class for all agents in the system."""
    def __init__(self, model_name: str = "gemini-1.5-flash-latest"):
        self.model = genai.GenerativeModel(model_name)
        
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Returns the system prompt that defines the agent's role and personality."""
        pass