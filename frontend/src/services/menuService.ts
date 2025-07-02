import toast from "react-hot-toast"
import axios from "./axios"

export const createdMenu = async (
    formData: FormData,
    restaurantId: string
  ) => {
    try{
        const res = await axios.post(`${restaurantId}/menu/`,formData)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const getMenu = async(restaurantId : string) => {
    try{
        const res = await axios.get(`${restaurantId}/menu/`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const deleteMenu = async(restaurantId : string,menuId : string) => {
    try{
        const res = await axios.delete(`${restaurantId}/menu/${menuId}`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

