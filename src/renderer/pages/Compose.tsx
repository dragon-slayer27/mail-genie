import { useState, useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { useHistoryStore } from '../stores/historyStore'
import { getAIProvider } from '../providers/factory'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, Undo, Redo, Send, Sparkles } from 'lucide-react'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [, setForceUpdate] = useState(0)

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => setForceUpdate(x => x + 1)

    editor.on('transaction', handleUpdate)
    editor.on('selectionUpdate', handleUpdate)

    return () => {
      editor.off('transaction', handleUpdate)
      editor.off('selectionUpdate', handleUpdate)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-border/60 bg-sidebar/50 select-none">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded-md transition-colors ${editor.isActive('underline') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Underline"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-border/60 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Numbered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        className={`p-1 rounded-md transition-colors ${editor.isActive('link') ? 'bg-primary text-surface shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
        title="Link"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-border/60 mx-1" />
      <button onClick={() => editor.chain().focus().undo().run()} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text transition-colors" title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text transition-colors" title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function Compose() {
  const { provider, geminiApiKey, googleClientId, googleClientSecret } = useSettingsStore()
  const addHistoryItem = useHistoryStore(state => state.addHistoryItem)

  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('Professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [showAI, setShowAI] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[350px] p-5 max-w-none text-text leading-relaxed'
      }
    }
  })

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setStatusMsg('Generating email...')
    try {
      const ai = getAIProvider(provider, { gemini: geminiApiKey })
      const res = await ai.generateEmail({ prompt, tone })
      setSubject(res.subject)
      editor?.commands.setContent(res.body)
      setStatusMsg('Email generated successfully!')
      setTimeout(() => setStatusMsg(''), 3000)
    } catch (e: unknown) {
      setStatusMsg('Generation failed: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSend = async () => {
    if (!to || !subject || !editor?.getHTML() || editor.getHTML() === '<p></p>') {
      setStatusMsg('Please fill in To, Subject, and Body.')
      return
    }

    setIsSending(true)
    setStatusMsg('Sending email...')
    try {
      const tokensStr = await window.electron.store.getSecure('gmailTokens')
      if (!tokensStr) throw new Error('Not authenticated with Gmail. Go to settings.')

      const tokens = JSON.parse(tokensStr)
      await window.electron.gmail.send(tokens, googleClientId, googleClientSecret, to, subject, editor.getHTML(), cc, bcc)

      addHistoryItem({
        id: Date.now().toString(),
        timestamp: Date.now(),
        to,
        cc,
        bcc,
        subject,
        body: editor.getHTML(),
        prompt,
        tone
      })

      setStatusMsg('Email sent successfully!')
      setTimeout(() => {
        setStatusMsg('')
        setTo('')
        setCc('')
        setBcc('')
        setSubject('')
        setPrompt('')
        editor?.commands.setContent('')
      }, 3000)
    } catch (e: unknown) {
      setStatusMsg('Error sending email: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setIsSending(false)
    }
  }

  const handleClear = () => {
    setPrompt('')
    setSubject('')
    editor?.commands.setContent('')
    setStatusMsg('')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Composer Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex justify-center bg-surface">
        <div className="w-full max-w-[950px] flex flex-col h-full space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80 select-none">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold tracking-wide uppercase font-mono">Compose Message</span>
              {statusMsg && (
                <span className="text-[10px] font-mono text-text-muted bg-surface-hover border border-border px-2 py-0.5 rounded">
                  {statusMsg}
                </span>
              )}
            </div>

            <button
              onClick={() => setShowAI(!showAI)}
              className={`px-2.5 py-1.5 rounded-md border border-border transition-all flex items-center space-x-1.5 text-xs font-medium ${showAI
                  ? 'bg-surface-hover text-text border-text/20 shadow-xs'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>
          </div>

          {/* Form + Editor */}
          <div className="flex-1 flex flex-col min-h-0 bg-surface-hover border border-border/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Headers (To, CC, BCC, Subject) */}
            <div className="divide-y divide-border/50 bg-sidebar/30">
              <div className="flex items-center px-4 py-2">
                <span className="text-text-muted w-16 select-none font-mono text-[10px] uppercase tracking-wider">To</span>
                <input
                  type="email"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-1 text-xs text-text placeholder-text-muted/50"
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                <div className="flex-1 flex items-center px-4 py-2">
                  <span className="text-text-muted w-16 select-none font-mono text-[10px] uppercase tracking-wider">CC</span>
                  <input
                    type="email"
                    value={cc}
                    onChange={e => setCc(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-1 text-xs text-text placeholder-text-muted/50"
                    placeholder="cc@example.com"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-2">
                  <span className="text-text-muted w-16 sm:pl-4 select-none font-mono text-[10px] uppercase tracking-wider">BCC</span>
                  <input
                    type="email"
                    value={bcc}
                    onChange={e => setBcc(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-1 text-xs text-text placeholder-text-muted/50"
                    placeholder="bcc@example.com"
                  />
                </div>
              </div>
              <div className="flex items-center px-4 py-2">
                <span className="text-text-muted w-16 select-none font-mono text-[10px] uppercase tracking-wider">Subject</span>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-1 text-xs text-text font-medium placeholder-text-muted/50 focus:text-text transition-colors"
                  placeholder="Subject of the email"
                />
              </div>
            </div>

            {/* TipTap Editor */}
            <div className="flex-1 flex flex-col min-h-0 bg-surface">
              <MenuBar editor={editor} />
              <div className="flex-1 overflow-y-auto cursor-text font-serif text-lg leading-relaxed px-4 py-3" onClick={() => editor?.commands.focus()}>
                <EditorContent editor={editor} className="prose prose-sm sm:prose lg:prose-lg prose-zinc dark:prose-invert focus:outline-none max-w-none" />
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-between items-center pt-1 select-none">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-md border border-border text-xs hover:bg-surface-hover hover:text-text transition-colors font-medium text-text-muted"
            >
              Clear Draft
            </button>

            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center space-x-2 bg-text text-surface px-4 py-2 rounded-md font-medium text-xs hover:bg-text/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_1px_2px_rgba(0,0,0,0.1)] border border-transparent dark:border-white/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-Docked AI Panel */}
      {showAI && (
        <div className="w-80 border-l border-border bg-sidebar p-5 flex flex-col space-y-4 select-none shrink-0 h-full overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <h3 className="font-mono text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-text-muted" />
              <span>AI Assistant</span>
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-text-muted">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-2.5 py-1.5 outline-none focus:border-text transition-colors text-xs text-text"
            >
              {['Professional', 'Friendly', 'Formal', 'Concise', 'Persuasive'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-text-muted">Instructions</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 w-full bg-surface border border-border rounded-md p-2.5 outline-none focus:border-text/30 focus:ring-1 focus:ring-text/5 transition-all text-xs resize-none leading-relaxed text-text placeholder-text-muted/40 shadow-inner"
              placeholder="e.g. Write a polite check-in email about the draft agreement..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full bg-text text-surface px-4 py-2 rounded-md font-medium text-xs hover:bg-text/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_1px_2px_rgba(0,0,0,0.1)] border border-transparent dark:border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Drafting...' : 'Generate Draft'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
