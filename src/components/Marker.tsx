import { mapState } from '@/atom'
import { StoreType } from '@/interface'
import { useCallback, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

interface MarkerProps {
  store: StoreType
}

export default function Marker({ store }: MarkerProps) {
  const map = useRecoilValue(mapState)

  const loadKakaoMarker = useCallback(() => {
    if (map && store) {
      // 현재 선택한 식당 데이터의 마커 띄우기
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
    }
  }, [map, store])

  useEffect(() => {
    loadKakaoMarker()
  }, [loadKakaoMarker, map])

  return <></>
}
