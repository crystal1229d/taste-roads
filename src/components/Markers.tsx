import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

interface MarkerProps {
  map: any
  storeData: any[]
  setCurrentStore: Dispatch<SetStateAction<any>>
}

export default function Markers({
  map,
  storeData,
  setCurrentStore,
}: MarkerProps) {
  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      storeData?.map((store) => {
        // 마커 아이콘
        const imageSrc = store?.bizcnd_code_nm
          ? `/images/markers/${store?.bizcnd_code_nm}.png`
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
          store?.y_dnts,
          store?.x_cnts,
        )

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        })

        marker.setMap(map)

        // 마커에 커서가 오버됐을 때의 커스텀 오버레이 (인포윈도우)
        const content = `<div class='infowindow'>${store?.upso_nm}</div>`
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
  }, [map, setCurrentStore, storeData])

  useEffect(() => {
    loadKakaoMarkers()
  }, [loadKakaoMarkers, map])

  return <></>
}
