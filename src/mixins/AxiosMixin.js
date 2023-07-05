import axios from '../utils/axios'

export default {
    data() {
        return {
            success: true
        }
    },
    methods: {
        async sendRequest(axiosConfig) {
            let exception;
            const resultPromise = await axios.request(
                axiosConfig
            ).catch(
                (e)=>{
                    exception = e
                    this.success = false;
                }
            )
            return this.success ? resultPromise : Promise.reject(exception);
        }
    },
  
}