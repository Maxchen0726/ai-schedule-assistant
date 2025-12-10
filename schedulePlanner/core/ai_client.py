# core/ai_client.py
import logging
import os

from google import genai

logger = logging.getLogger(__name__)

API_KEY = os.environ.get("GEMINI_API_KEY")

# 不要在没有 key 的时候强行 new Client
if API_KEY:
    client = genai.Client(api_key=API_KEY)
else:
    client = None
    logger.warning("GEMINI_API_KEY not set. AI calls will return fallback text.")


def call_gemini(prompt: str) -> str:
    """
    调用 Gemini 2.5 Flash，出任何错都返回一段友好的提示，绝不抛异常。
    """
    # 没有 client（没配置 API Key）→ 直接提示
    if client is None:
        return "AI 服务未配置（缺少 GEMINI_API_KEY），目前使用占位回答。"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = (response.text or "").strip()
        if not text:
            return "AI 没有返回内容，请稍后再试。"
        return text
    except Exception as e:
        logger.exception("Error calling Gemini API: %s", e)
        return "AI 服务暂时不可用，请稍后再试。"