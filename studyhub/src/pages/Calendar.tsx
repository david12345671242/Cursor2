import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import RequireAuth from '../components/RequireAuth'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  color?: string
}

export default function CalendarPage() {
  const { user } = useStore()
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('events')
        .select('id,title,start,end,color')
        .eq('user_id', user.id)
        .order('start', { ascending: true })
      setEvents((data as any[])?.map(e => ({...e, start: e.start, end: e.end})) ?? [])
    }
    load()
  }, [user])

  const addEvent = async (arg: any) => {
    const title = prompt('Titre de l\'événement ?')
    if (!title || !user) return
    const start = arg.startStr
    const end = arg.endStr
    const { data, error } = await supabase.from('events').insert({
      title, start, end, user_id: user.id
    }).select('id,title,start,end,color').single()
    if (!error && data) setEvents(prev => [...prev, data as any])
  }

  const deleteEvent = async (clickInfo: any) => {
    if (!confirm(`Supprimer \"${clickInfo.event.title}\" ?`)) return
    const id = clickInfo.event.id
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const updateEvent = async (changeInfo: any) => {
    const id = changeInfo.event.id
    const start = changeInfo.event.startStr
    const end = changeInfo.event.endStr
    await supabase.from('events').update({ start, end }).eq('id', id)
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Calendrier</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
          }}
          selectable
          editable
          events={events}
          dateClick={addEvent}
          eventClick={deleteEvent}
          eventDrop={updateEvent}
          eventResize={updateEvent}
          height="80vh"
        />
      </div>
    </RequireAuth>
  )
}