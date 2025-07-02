import toast from "react-hot-toast"
import axios from "./axios"


export const getAllTable = async(restaurantId: string) => {
    try{
        const res = await axios.get(`${restaurantId}/table/`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const createTable = async(data : {
    restaurantId: string,
    name: string
}) => {
    const { restaurantId, name } = data
    try{
        const res = await axios.post(`${restaurantId}/table/`,{ name })
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const updateActiveTable =async (data:{
    restaurantId: string,
    tableId: string,
    isActive: boolean,
    currentOccupancy?: Number
}) => {
    const { restaurantId , tableId , isActive ,currentOccupancy} = data
    try{
        if (!isActive && currentOccupancy != null) {
            throw new Error("If table is not active, it can't have currentOccupancy");
        }        
        const res = await axios.patch(`${restaurantId}/table/${tableId}`,{ isActive,currentOccupancy })
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
    
}