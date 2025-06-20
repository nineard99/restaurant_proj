import toast from "react-hot-toast"
import axios from "./axios"
import { OrderDetail } from "@/types/order"


export const getAllOrderBySession = async(restaurantId: string,sessionId:string) => {
    try{
        const res = await axios.get(`${restaurantId}/order/${sessionId}`)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const createOrder = async (
    restaurantId: string,
    sessionId: string,
    payload: { orderItems: OrderDetail[] }
  ) => {
    try {
      const res = await axios.post(`${restaurantId}/order/${sessionId}`, payload);
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด");
    }
};

export const getAllOrder =async (restaurantId:string) => {
  try {
    const res = await axios.get(`${restaurantId}/order`);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด");
  }
  
}