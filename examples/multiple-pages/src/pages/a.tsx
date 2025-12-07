import { useEffect } from 'react'

console.log('a page file loaded')

const a = () => {
  console.log('a page')
  useEffect(() => {
    console.log('a page - client side')
  }, [])
  return (
    <div>a</div>
  )
}

export default a
