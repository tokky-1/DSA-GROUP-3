from ollama import Client

from app.core.config import SETTINGS

def ollama_nlp_layer(raw_text):
    # Instructions for the model to handle your specific handwriting errors
    system_prompt = (
        "You are an expert OCR post-processor. "
        "Restructure and fix errors in this handwritten transcription. "
        "Fix visual misreads like 'far' -> 'for', '11' -> 'I'll', and 'votes' -> 'routes'. "
        "Maintain the original tone and line breaks. Output ONLY the corrected text."
    )

    # We use llama3.2 because it is fast and fits well in Colab's free GPU
    # (Make sure you ran !ollama pull llama3.2 previously)


    # Load the Ollama CLient
    client = Client(
      host="https://ollama.com",
      headers={'Authorization': 'Bearer ' + SETTINGS.ollama_api_key}
    )

    # Define the
    messages = [
      {
          'role': 'system',
          'content': (
            "You are an expert OCR post-processor. "
            "Restructure and fix errors in this handwritten transcription. "
            "Fix visual misreads like 'far' -> 'for', '11' -> 'I'll', and 'votes' -> 'routes'. "
            "Maintain the original tone and line breaks. Output ONLY the corrected text."
        )
      },
      {
        'role': 'user',
        'content': raw_text,
      },
    ]

    response = client.chat('gpt-oss:120b', messages=messages)

    return response['message']['content']