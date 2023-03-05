<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Laravel\Facades\OpenAI;

class DefaultController extends Controller
{
    public function index()
    {
        $messages = collect(session('messages', []))->reject(fn ($message) => $message['role'] === 'system');

        return Inertia::render('Index', [
            'messages' => $messages->values()
        ]);
    }

    public function store(StoreMessageRequest $request)
    {
        try {
            $messages = $request->session()->get('messages', [
                ['role' => 'system', 'content' => 'You are LaravelGPT - A ChatGPT clone. Answer as concisely as possible.']
            ]);
            
            $messages[] = ['role' => 'user', 'content' => $request->input('message')];
            
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages
            ]);
        
            $messages[] = ['role' => 'assistant', 'content' => $response->choices[0]->message->content];
        
            $request->session()->put('messages', $messages);
        } catch (Exception $e) {
            $request->session()->flash('error', $e->getMessage());
            $request->session()->forget('messages');
        }
    
        return redirect('/');
    }
}
