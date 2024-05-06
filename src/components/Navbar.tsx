"use client"
import {
  ArrowUpCircle,
  CloudSunRain,
  Heart,
  Home,
  Languages,
  Moon,
  Save,
  Share,
  Sun,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedRedux"
import { setTheme } from "@/redux/reducers/geonameSlice"

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.cities)
  const handleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"))
  }
  return (
    <div className='w-full px-12 p-3 bg-slate-800 text-white flex items-center justify-between'>
      <Link href={"/"} id='icon'>
        <CloudSunRain />
      </Link>
      <nav className='flex gap-6'>
        <h1 className='text-2xl hidden md:block'>Weather Forecast App</h1>
      </nav>
      <div className='flex items-center gap-3'>
        <Link
          href={`/`}
          className='text-white flex items-center gap-2 p-2 rounded-md'
        >
          <Home size={16} />
          All
        </Link>
        <Link
          href={"/favorites"}
          className='text-pink-500 hover:bg-pink-400 hover:text-white flex items-center gap-2 border border-pink-600 p-2 rounded-md'
        >
          <Heart size={16} />
          My Favorites
        </Link>
        <button
          className='p-2 text-sm rounded-full bg-blue-400/70 block'
          onClick={handleTheme}
        >
          {theme !== "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div id='profile' className='flex gap-2'>
          <Image src={"/user1.svg"} alt='User Profile' width={40} height={40} />
          {/* <div className='flex flex-col text-sm justify-center'>
            <p>User Name</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Navbar
