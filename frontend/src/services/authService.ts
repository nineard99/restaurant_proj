import toast from "react-hot-toast"
import axios from "./axios"

export const register = async(data : {
    username: string
    email: string
    password: string
}) => {
    try{
        const res = await axios.post('/auth/register',data)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}

export const login = async(data : { username: string , password: string}) => {
    try{
        const res = await axios.post('/auth/login',data)
        return res.data
    }catch(err:any){
        toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาด")
    }
}
export const getMe = async () => {
  try {
    const res = await axios.get("/auth/me"); // cookie ถูกแนบให้อัตโนมัติ
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "ไม่สามารถดึงข้อมูลผู้ใช้ได้");
  }
};

export const authorize = async () => {
    try {
      const res = await axios.get('/auth/authorize'); // เรียกตรวจสอบสิทธิ์
      return res.data; // อาจเป็นข้อมูลสิทธิ์ หรือ boolean
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "ไม่สามารถตรวจสอบสิทธิ์ได้");
    }
};