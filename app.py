from flask import Flask, request, jsonify, render_template
import openai

app = Flask(__name__)

# Replace 'your-api-key' with your actual OpenAI API key
api_key = 'sk-proj-nE8oSRYkpjGdVdpoBABhT3BlbkFJ5hAxx3x0fUcucV5hJEHG'
openai.api_key = api_key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/debate')
def debate():
    return render_template('debate.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    user_input = data['text']
    
    # Define the prompt to detect misinformation
    prompt = f"The following is a conversation. If any misinformation is detected, provide a correction. If the statements are correct, respond with 'No correction needed'.\nConversation:\n{user_input}"

    # Make a request to the ChatGPT API
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=150
    )

    # Get the response from ChatGPT
    chatgpt_response = response.choices[0].message['content'].strip()
    
    if chatgpt_response.lower() == "no correction needed":
        chatgpt_response = ""
    
    return jsonify({'response': chatgpt_response})

if __name__ == '__main__':
    app.run(debug=True)