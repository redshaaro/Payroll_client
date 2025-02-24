import React from 'react'
import { Link } from "react-router";


const GenerateExcel = () => {


    return (
        <Link className=' m-3 px-4 py-2 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 cursor-pointer' to="http://localhost:3000/api/excel/generate">Generate-Excel</Link>
    )
}

export default GenerateExcel