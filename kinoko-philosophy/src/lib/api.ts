export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callClaude(messages: ChatMessage[], phase: 'philosophy' | 'reveal' | 'report'): Promise<string> {
  try {
    console.log(`[API] Request: phase=${phase}, messages=${messages.length}`);
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        phase,
      }),
    });

    console.log(`[API] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] HTTP Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[API] Response data:`, data);
    
    if (data.error) {
      console.error(`[API] Server Error:`, data);
      throw new Error(`Server Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
    }
    
    console.log(`[API] Success: ${data.content?.length || 0} characters`);
    return data.content;
  } catch (error) {
    console.error('[API] Full error details:', error);
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message);
      console.error('[API] Error stack:', error.stack);
    }
    
    // エラーの詳細を含む情報を返す
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`API Error: ${errorMessage}`);
  }
}

