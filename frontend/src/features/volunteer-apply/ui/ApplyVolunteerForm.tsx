import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { volunteersApi } from '@entities/volunteer'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

interface ApplyVolunteerFormProps {
  eventId: string
  onSuccess?: () => void
}

export function ApplyVolunteerForm({ eventId, onSuccess }: ApplyVolunteerFormProps) {
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const mutation = useMutation({
    mutationFn: () => volunteersApi.apply(eventId, skills),
    onSuccess,
  })

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setSkillInput('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Например: регистрация, перевод"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          className="flex-1"
        />
        <Button variant="secondary" onClick={addSkill} type="button">Добавить</Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-2 py-1 rounded-full">
              {s}
              <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-indigo-900 cursor-pointer">×</button>
            </span>
          ))}
        </div>
      )}
      {mutation.isError && <p className="text-sm text-red-500">Ошибка при подаче заявки</p>}
      {mutation.isSuccess && <p className="text-sm text-green-600">Заявка подана!</p>}
      <Button
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        disabled={skills.length === 0}
        className="w-full"
      >
        Подать заявку волонтёра
      </Button>
    </div>
  )
}
