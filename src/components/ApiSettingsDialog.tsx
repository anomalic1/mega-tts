import { useEffect, useState } from 'react'
import { KeyRound, Link2, RotateCcw, Sparkles, X } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useSettings, type CustomVoice } from '@/context/SettingsContext'
import { resolveSpeechEndpoint } from '@/lib/utils'

/**
 * API Settings: custom endpoint (auto-sanitized), optional Bearer key
 * (sessionStorage only), and custom voice IDs. Missing env never errors —
 * it just means the user should enter an endpoint here.
 */
export function ApiSettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useSettings()
  const [baseUrlDraft, setBaseUrlDraft] = useState('')
  const [keyDraft, setKeyDraft] = useState('')
  const [voiceName, setVoiceName] = useState('')
  const [voiceId, setVoiceId] = useState('')

  useEffect(() => {
    if (open) {
      setBaseUrlDraft(settings.baseUrl)
      setKeyDraft(settings.apiKey)
    }
  }, [open, settings.baseUrl, settings.apiKey])

  const preview = resolveSpeechEndpoint(baseUrlDraft || settings.envBaseUrl)

  const save = () => {
    settings.setBaseUrl(baseUrlDraft.trim())
    settings.setApiKey(keyDraft.trim())
    onClose()
  }

  const addVoice = () => {
    const name = voiceName.trim()
    const id = voiceId.trim()
    if (!name || !id) return
    settings.addCustomVoice({ id, name })
    setVoiceName('')
    setVoiceId('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="API Settings"
      description="Point Zydit at any OpenAI-compatible speech endpoint. Everything here stays in your browser."
      className="max-w-xl"
    >
      <div className="space-y-6">
        {/* Endpoint */}
        <div className="space-y-2">
          <label htmlFor="api-base-url" className="flex items-center gap-2 text-[13px] font-medium text-zinc-200">
            <Link2 className="size-3.5 text-titanium-500" aria-hidden />
            API Base URL
          </label>
          <div className="flex gap-2">
            <input
              id="api-base-url"
              value={baseUrlDraft}
              onChange={(e) => setBaseUrlDraft(e.target.value)}
              placeholder={settings.envBaseUrl || 'https://your-gateway.example.com'}
              spellCheck={false}
              autoComplete="off"
              className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
            />
            {settings.baseUrl && (
              <Button variant="outline" size="sm" onClick={() => setBaseUrlDraft('')} title="Use the server default">
                <RotateCcw className="size-3.5" aria-hidden />
                Reset
              </Button>
            )}
          </div>
          <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 font-mono text-[11px] leading-relaxed text-titanium-500">
            <span className="text-titanium-400">Will call:</span>{' '}
            {preview || <span className="italic">no endpoint yet — set one above</span>}
          </p>
          <p className="text-[11px] text-titanium-500">
            Leave empty to use the server default{settings.envBaseUrl ? '' : ' (none configured — enter a URL above)'}.
            {' '}<code className="text-titanium-400">/v1/audio/speech</code> is appended automatically if missing.
          </p>
        </div>

        {/* API key */}
        <div className="space-y-2">
          <label htmlFor="api-key" className="flex items-center gap-2 text-[13px] font-medium text-zinc-200">
            <KeyRound className="size-3.5 text-titanium-500" aria-hidden />
            Bearer API Key <span className="font-normal text-titanium-500">(optional)</span>
          </label>
          <input
            id="api-key"
            type="password"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="xi-api-key or Bearer token"
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
          />
          <p className="text-[11px] text-titanium-500">
            Stored only in <span className="text-titanium-400">sessionStorage</span> — it is wiped the moment you close this tab, and never sent anywhere except your chosen endpoint.
          </p>
        </div>

        {/* Custom voices */}
        <div className="space-y-2">
          <label htmlFor="custom-voice-name" className="flex items-center gap-2 text-[13px] font-medium text-zinc-200">
            <Sparkles className="size-3.5 text-titanium-500" aria-hidden />
            Custom Voices <span className="font-normal text-titanium-500">(by voice ID)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="custom-voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Name"
              className="h-10 w-32 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
            />
            <input
              aria-label="Voice ID"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              placeholder="Voice ID, e.g. 21m00Tcm4TlvDq8ikWAMC"
              spellCheck={false}
              className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
            />
            <Button variant="outline" size="sm" onClick={addVoice} disabled={!voiceName.trim() || !voiceId.trim()}>
              Add
            </Button>
          </div>
          {settings.customVoices.length > 0 && (
            <ul className="space-y-1.5">
              {settings.customVoices.map((v: CustomVoice) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs"
                >
                  <span className="text-zinc-300">
                    {v.name} <span className="font-mono text-titanium-500">· {v.id}</span>
                  </span>
                  <button
                    onClick={() => settings.removeCustomVoice(v.id)}
                    className="text-titanium-500 transition-colors hover:text-red-300"
                    aria-label={`Remove custom voice ${v.name}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    </Dialog>
  )
}
