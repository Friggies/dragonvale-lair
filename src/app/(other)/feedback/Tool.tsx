'use client'

import { useState } from 'react'
import supabase from '@/utils/supabaseClient'
import styles from './Tool.module.scss'

export default function Tool() {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const sendContent = async () => {
        if (!content.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter some feedback before sending.',
            })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const { data, error } = await supabase
                .from('feedback')
                .insert([{ content }])

            if (error) {
                throw error
            }

            setContent('')
            setMessage({
                type: 'success',
                text: 'Thanks! Your feedback has been sent to me.',
            })
        } catch (err: any) {
            console.error('Insert error:', err)
            const errMsg = err.message || JSON.stringify(err)
            setMessage({
                type: 'error',
                text: `Error sending feedback: ${errMsg}`,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={styles.form}>
            <div className={styles.paper}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your feedback or new ideas here... (I add new dragons and egg images as soon as I have time to do so, please be patient with me)"
                />
            </div>

            <button
                onClick={sendContent}
                disabled={loading}
                className="button"
            >
                {loading ? 'Sending…' : 'Send Feedback'}
            </button>

            {message && (
                <p
                    className={`${
                        message.type === 'success' ? 'green' : 'red'
                    }`}
                >
                    {message.text}
                </p>
            )}
        </form>
    )
}
