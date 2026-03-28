import { useState } from 'react'
import { motion } from 'framer-motion'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.9)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  width: '100%',
  outline: 'none',
  fontFamily: 'var(--font-body)',
}

const labelStyle = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 400,
  marginBottom: '6px',
  display: 'block',
}

export default function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    live: '',
    github: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    onAdd({
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      links: {
        live: form.live.trim(),
        github: form.github.trim(),
      },
    })
  }

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: '#1a1a1e',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          className="text-center tracking-[0.15em] uppercase mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Add Project
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={update('title')}
              placeholder="Project name"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={update('description')}
              placeholder="Short description of the project"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={update('image')}
              placeholder="https://... (optional)"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={update('tags')}
              placeholder="React, Node.js, PostgreSQL"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Live URL</label>
              <input
                type="text"
                value={form.live}
                onChange={update('live')}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input
                type="text"
                value={form.github}
                onChange={update('github')}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-300"
              style={{
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-300"
              style={{
                color: '#0a0a0a',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            >
              Add Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
