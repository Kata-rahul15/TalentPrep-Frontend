import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, Trash2, Bot, User, Loader2 } from 'lucide-react'
import { useResumeChat } from '../hooks/useResume'
import { suggestedQuestions } from '../mock/resumeMock'
import { cn } from '@/lib/utils'

// Minimal markdown renderer for bold and line breaks
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

export default function ResumeChat() {
  const { messages, isLoading, error, sendMessage, clearHistory } = useResumeChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 flex-wrap gap-2">
        <div>
          <h1 className="font-heading font-black text-2xl text-foreground">Resume Chat</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ask AI anything about your resume</p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-danger transition-colors px-3 py-1.5 rounded-lg hover:bg-danger/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Chat container */}
      <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    msg.role === 'user'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary-bg border border-border text-muted-foreground'
                  )}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-secondary-bg/50 border border-border text-secondary-foreground rounded-tl-sm'
                  )}
                >
                  {renderMarkdown(msg.content)}
                  <p className={cn('text-[10px] mt-1.5', msg.role === 'user' ? 'text-white/60' : 'text-muted-foreground')}>
                    {new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp))}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-secondary-bg border border-border text-muted-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 bg-secondary-bg/50 border border-border rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl text-xs text-danger">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (show when only welcome message) */}
        {messages.length === 1 && (
          <div className="px-5 py-3 border-t border-divider">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Suggested Questions</p>
            <div className="flex gap-2 flex-wrap">
              {suggestedQuestions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-secondary-bg border border-border text-secondary-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-divider p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your resume... (Enter to send)"
                rows={1}
                className="w-full resize-none bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed min-h-[46px] max-h-32"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                }}
                disabled={isLoading}
                aria-label="Chat message input"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Press <kbd className="px-1 py-0.5 bg-secondary-bg border border-border rounded text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-secondary-bg border border-border rounded text-[10px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  )
}
