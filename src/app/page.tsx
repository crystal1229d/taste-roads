import Map from '@/components/Map'
import Markers from '@/components/Markers'
import StoreBox from '@/components/StoreBox'
import CurrentLocationButton from '@/components/currentLocationButton'

import { StoreType } from '@/interface'

// export default function Home({ stores }: { stores: StoreType[] }) {
export default async function Home() {
  const stores: StoreType[] = await getData()

  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  )
}

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    return res.json()
  } catch (e) {
    console.log(e)
  }
}

// export async function getServerSideProps() {
//   const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)

//   return {
//     props: { stores: stores.data },
//   }
// }