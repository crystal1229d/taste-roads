import { StoreType } from '@/interface'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

interface MarkerProps {
  map: any
  stores: StoreType[]
  setCurrentStore: Dispatch<SetStateAction<any>>
}

export default function Markers({ map, stores, setCurrentStore }: MarkerProps) {
  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      stores?.map((store) => {
        // 마커 아이콘
        const imageSrc = store?.category
          ? `/images/markers/${store?.category}.png`
          : '/images/markers/default.png'
        const imageSize = new window.kakao.maps.Size(40, 40)
        const imageOption = {
          offset: new window.kakao.maps.Point(27, 69),
        }
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        )

        // 마커 위치
        const markerPosition = new window.kakao.maps.LatLng(
          store?.lat,
          store?.lng,
        )

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        })

        marker.setMap(map)

        // 마커에 커서가 오버됐을 때의 커스텀 오버레이 (인포윈도우)
        const content = `<div class='infowindow'>${store?.name}</div>`
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          xAnchor: 0.6,
          yAnchor: 0.91,
        })
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          customOverlay.setMap(map)
        })
        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          customOverlay.setMap(null)
        })

        // 선택한 가게 저장
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setCurrentStore(store)
        })
      })
    }
  }, [map, setCurrentStore, stores])

  useEffect(() => {
    loadKakaoMarkers()
  }, [loadKakaoMarkers, map])

  return <></>
}
