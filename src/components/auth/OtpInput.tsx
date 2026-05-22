import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react'

const LENGTH = 6

type OtpInputProps = {
  value: string
  onChange: (value: string) => void
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('')

  const updateDigit = (index: number, digit: string) => {
    const next = digits.map((d, i) => (i === index ? digit : d === ' ' ? '' : d))
    const joined = next.join('').replace(/\s/g, '').slice(0, LENGTH)
    onChange(joined)
    if (digit && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    onChange(pasted)
    const focusIndex = Math.min(pasted.length, LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <div className="auth-otp">
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() ?? ''}
          onChange={(e) => updateDigit(i, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Dígito ${i + 1}`}
        />
      ))}
    </div>
  )
}
