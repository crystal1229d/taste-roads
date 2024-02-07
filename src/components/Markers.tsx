import { currentStoreState, locationState, mapState } from '@/atom'
import { StoreType } from '@/interface'
import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

interface MarkerProps {
  stores: StoreType[]
}

export default function Markers({ stores }: MarkerProps) {
  const map = useRecoilValue(mapState)
  const setCurrentStore = useSetRecoilState(currentStoreState)
  const [location, setLocation] = useRecoilState(locationState)

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
          setLocation({
            ...location,
            lat: store.lat,
            lng: store.lng,
          })
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stores])

  useEffect(() => {
    loadKakaoMarkers()
  }, [loadKakaoMarkers, map])

  return <></>
}
