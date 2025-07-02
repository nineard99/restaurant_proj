import toast from "react-hot-toast"
import axios from "./axios"

export const createdRestaurant = async(data : {
    name: string
    address: string
    image: string
}) => {
    try{
        const res = await axios.post('/restaurant/create',data)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const getRestaurantById = async(restaurantId : string) => {
    try{
        const res = await axios.get(`/restaurant/${restaurantId}`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const getallRestaurantByUser = async() => {
    try{
        const res = await axios.get('/restaurant/')
        // console.log(res.data)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const deleteRestaurantById = async(restaurantId: string) => {
    try{
        const res = await axios.delete(`/restaurant/${restaurantId}`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")

    }
}
