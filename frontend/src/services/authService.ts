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
      const message = err?.response?.data?.message || err.message || "Unexpected error";
      throw new Error(message);
    }
}

export const login = async(data : { username: string , password: string}) => {
    try{
        const res = await axios.post('/auth/login',data)
        return res.data
    }catch(err:any){
      const message = err?.response?.data?.message || err.message || "Unexpected error";
      throw new Error(message);
    }
}

export const logoutService = async() => {
  try{
      const res = await axios.post('/auth/logout')
      return res.data
  }catch(err:any){
    const message = err?.response?.data?.message || err.message || "Unexpected error";
    throw new Error(message);
  }
}

export const getMe = async () => {
  try {
    const res = await axios.get("/auth/me"); // cookie ถูกแนบให้อัตโนมัติ
    return res.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || err.message || "Unexpected error";
    throw new Error(message);
  }
};

export const authorize = async () => {
    try {
      const res = await axios.get('/auth/authorize'); // เรียกตรวจสอบสิทธิ์
      return res.data; // อาจเป็นข้อมูลสิทธิ์ หรือ boolean
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Unexpected error";
      throw new Error(message);
    }
};