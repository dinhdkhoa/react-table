"use client"
import { Button } from "@/components/ui/button"
import http from "@/lib/https"
import { useEffect, useRef, useState } from "react"

interface divInfo {
  top: number
  left: number
  width: number
  height: number
  visible: boolean
  name: string
}

export default function Demo() {
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [divs, setDivs] = useState<divInfo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await http.get<divInfo[]>("api/demo", { baseUrl: "" })
        if (result) {
          setDivs(result.payload)
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }
    fetchData() 
  }, [])

  const imgLeftPosition = imgRef.current
    ? imgRef.current.getBoundingClientRect().left
    : 0
  const imgTopPosition = imgRef.current
    ? imgRef.current.getBoundingClientRect().top
    : 0

  const hideDiv = (name: string) => {
    console.log(divs)
    setDivs((prevDivs) =>
      prevDivs.map((div) =>
        div.name === name ? { ...div, visible: !div.visible } : div
      )
    )
  }
  return (
    <>
      <div className="flex gap-4">
        <div>
          <img
            ref={imgRef}
            className="ml-40"
            src="https://images.unsplash.com/photo-1526657782461-9fe13402a841?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9wZW4lMjBzb3VyY2V8ZW58MHx8MHx8fDA%3D"
            alt="Next.js Logo"
            width={600}
            height={700}
          />
          {divs.map((div) =>
            div.visible ? (
              <div
                key={div.name}
                style={{
                  position: "absolute",
                  left: imgLeftPosition + div.left,
                  top: imgTopPosition + div.top,
                  backgroundColor: "transparent",
                  border: "2px solid red",
                  width: div.width,
                  height: div.height
                }}
              ></div>
            ) : null
          )}
        </div>
        <div className="column">
          {divs.map((div) => (
            <Button
              variant={"ghost"}
              key={div.name}
              onClick={() => hideDiv(div.name)}
            >
              {div.name}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
