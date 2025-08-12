import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { extractTextFromFile } from '../lib/extractors'
import { generateWithAI } from '../lib/ai'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import RequireAuth from '../components/RequireAuth'

interface Course { id: string; title: string; text: string | null; file_url: string | null; created_at: string }

export default function Courses() {
  const { user } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    if (!user) return
    supabase.from('courses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setCourses(data as any || []))
  }, [user])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return
    setUploading(true)
    setProgress(0)
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      const title = file.name.replace(/\.[^.]+$/, '')
      const { data: course, error } = await supabase.from('courses').insert({ title, user_id: user.id }).select('*').single()
      if (error || !course) continue
      // try upload to storage bucket "courses"
      try {
        const path = `${user.id}/${course.id}/${file.name}`
        await supabase.storage.from('courses').upload(path, file, { upsert: true })
        await supabase.from('courses').update({ file_url: path }).eq('id', course.id)
      } catch {}
      // extract text
      const text = await extractTextFromFile(file)
      await supabase.from('courses').update({ text }).eq('id', course.id)
      setCourses(prev => [{...course, text, file_url: course.file_url}, ...prev])
      setProgress(Math.round(((i+1) / acceptedFiles.length) * 100))
    }
    setUploading(false)
  }, [user])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const generateAll = async (course: Course) => {
    if (!user || !course.text) return
    const [qcm, fcs, sum] = await Promise.all([
      generateWithAI('qcm', course.text),
      generateWithAI('flashcards', course.text),
      generateWithAI('summary', course.text)
    ])
    // save
    if (Array.isArray(qcm)) {
      await supabase.from('qcm_questions').insert(qcm.map((q: any) => ({...q, course_id: course.id, user_id: user.id})))
    }
    if (Array.isArray(fcs)) {
      await supabase.from('flashcards').insert(fcs.map((c: any) => ({...c, course_id: course.id, user_id: user.id})))
    }
    if (sum?.summary) {
      await supabase.from('summaries').insert({ course_id: course.id, user_id: user.id, content: sum.summary })
    }
    alert('Contenus générés')
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive? 'bg-sky-50 dark:bg-sky-950' : ''}`}>
          <input {...getInputProps()} />
          <p className="font-medium">Glisser-déposer des fichiers ici, ou cliquez pour choisir</p>
          <p className="text-sm text-neutral-500 mt-1">Formats: pdf, docx, txt, jpg, jpeg, png</p>
        </div>
        {uploading && <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded h-2 overflow-hidden"><div className="bg-sky-500 h-2" style={{width: `${progress}%`}}/></div>}
        <div className="grid gap-4">
          {courses.map(c => (
            <div key={c.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-neutral-500">{new Date(c.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>generateAll(c)}>Générer (IA)</button>
                </div>
              </div>
              {c.text && <p className="text-sm mt-3 line-clamp-5 whitespace-pre-wrap">{c.text.slice(0, 1000)}{c.text.length > 1000 ? '…' : ''}</p>}
            </div>
          ))}
        </div>
      </div>
    </RequireAuth>
  )
}