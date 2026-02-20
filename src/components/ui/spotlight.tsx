import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function Spotlight({ size = 300 }: { size?: number }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

    const mouseX = useSpring(0, { stiffness: 50, damping: 20 })
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 })

    const left = useTransform(mouseX, (x) => `${x - size / 2}px`)
    const top = useTransform(mouseY, (y) => `${y - size / 2}px`)

    useEffect(() => {
        if (typeof window === "undefined") return;
        const parent = containerRef.current?.parentElement;
        if (parent) setParentElement(parent);
    }, [])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!parentElement) return
            const rect = parentElement.getBoundingClientRect()
            mouseX.set(e.clientX - rect.left)
            mouseY.set(e.clientY - rect.top)
        },
        [mouseX, mouseY, parentElement]
    )

    useEffect(() => {
        if (!parentElement) return
        parentElement.addEventListener('mousemove', handleMouseMove)
        return () => parentElement.removeEventListener('mousemove', handleMouseMove)
    }, [parentElement, handleMouseMove])

    return (
        <motion.div
            ref={containerRef}
            className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_80%)] blur-3xl z-10"
            style={{ width: size, height: size, left, top }}
        />
    )
}
