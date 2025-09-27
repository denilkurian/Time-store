import Lottie from "lottie-react"
import loaderAnimation from '../../assets/jsons/loader.json'


const Loader = () => {
  return (
    <Lottie animationData={loaderAnimation} loop={true} style={{ height: 300, width: 300 }} />
  )
}

export default Loader
