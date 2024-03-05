import Map from '@/components/Map'
import Markers from '@/components/Markers'
import StoreBox from '@/components/StoreBox'
import CurrentLocationButton from '@/components/currentLocationButton'

import { StoreType } from '@/interface'
import axios from 'axios'

export default function Home({ stores }: { stores: StoreType[] }) {
  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  )
}

export async function getServerSideProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)

  return {
    props: { stores: stores.data },
  }
}
