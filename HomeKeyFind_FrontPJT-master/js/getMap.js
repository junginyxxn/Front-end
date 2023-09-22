let btnShow = document.getElementById("list-btn");
var searchResult = [];
var positions = [];
// 마커를 담을 배열입니다
var markers = [];
var infowindow;
var ps;

var mapContainer = document.getElementById("map"); // 지도를 표시할 div
mapOption = {
  center: new kakao.maps.LatLng(36.355116, 127.298372), // 지도의 중심좌표
  level: 5, // 지도의 확대 레벨
};
var map = new kakao.maps.Map(mapContainer, mapOption);

async function startmap() {
  searchResult = [];
  let url =
    "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

  let queryParams =
    encodeURIComponent("serviceKey") +
    "=" +
    "YtHaTTybHZjA87qFLAUt1GA7OOqe6LzkjwmamcSio1OIMntlouBgj8clfz9JSkOxmmbPbNDJdtZae%2BKOuUBL2A%3D%3D";
  /*Service Key*/
  let yyyy = document.getElementById("year").value;
  let mm = document.getElementById("month").value;
  if (yyyy == "전체") {
    yyyy = 2015;
  }
  if (mm == "전체") {
    mm = 12;
  }
  let dealYM = yyyy + "" + mm;
  let gugun = document.getElementById("gugun").value;
  if (gugun == "전체") {
    gugun = 11110;
  } else {
    gugun = gugun.substr(0, 5);
  }
  console.log(gugun);
  queryParams +=
    "&" +
    encodeURIComponent("LAWD_CD") +
    "=" +
    encodeURIComponent(parseInt(gugun)); /*아파트소재 구군*/
  queryParams +=
    "&" + encodeURIComponent("DEAL_YMD") + "=" + encodeURIComponent(dealYM); /*조회년월*/
  queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /*페이지번호*/
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("100"); /*페이지당건수*/
  let response = await fetch(`${url}?${queryParams}`);
  let data = await response.text();

  await makeList(data); //동정보 기반으로
  positions = await getPosition(searchResult);
}

// 동+지번을 기반으로 위치 좌표를 구해서 지도에 핀 찍기 위한 함수
async function getPosition(searchResult) {
  // var mapContainer = document.getElementById("map"); // 지도를 표시할 div
  // mapOption = {
  //   center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
  //   level: 5, // 지도의 확대 레벨
  // };
  // var map = new kakao.maps.Map(mapContainer, mapOption);

  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
  console.log(searchResult);

  let desDiv = document.getElementById("description");
  if (searchResult.length == 0) {
    console.log("검색 결과가 없습니다");
    desDiv.innerText = "검색 결과가 없습니다.";
    document.getElementById("resultTitle").innerText = "결과조회 (" + searchResult.length + ")";
  } else {
    desDiv.innerText = "";
    document.getElementById("resultTitle").innerText = "결과조회 (" + searchResult.length + ")";
  }
  searchResult.forEach(async (apt) => {
    var geocoder = await new kakao.maps.services.Geocoder();
    geocoder.addressSearch(
      apt.querySelector("법정동").textContent + " " + apt.querySelector("지번").textContent,
      function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          positions.push(new kakao.maps.LatLng(result[0].y, result[0].x));
          // 마커 이미지의 이미지 크기
          var imageSize = new kakao.maps.Size(24, 35);

          // 마커 이미지를 생성합니다
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

          // 마커를 생성합니다
          var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치
            // title : apt.querySelector("거래금액").textContent, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
          });
          let lastPosition = new kakao.maps.LatLng(result[0].y, result[0].x); //지도 센터 좌표값
          console.log(result[0].y, result[0].x);
          map.setCenter(lastPosition);
        }
      }
    );
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    let title = document.createElement("h5");
    title.setAttribute("class", "card-title");
    title.innerText = apt.querySelector("아파트").textContent;

    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerText = "거래금액: ";
    cardText.innerText += apt.querySelector("거래금액").textContent;
    cardText.innerText += `(만원)`;
    let cardText2 = document.createElement("p");
    cardText2.innerText = "전용면적: ";
    cardText2.innerText += apt.querySelector("전용면적").textContent;
    cardText2.innerText += "(m2)";

    cardBody.appendChild(title);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardText2);
    cardDiv.appendChild(cardBody);
    desDiv.append(cardDiv);

    //////////////////////////////////////////////////////////////////////////////////
    // 장소 검색 객체를 생성합니다
    ps = new kakao.maps.services.Places();

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 키워드로 장소를 검색합니다
    let dongdong = searchResult[0].querySelector("법정동").textContent.substr(1);
    console.log(dongdong);
    searchPlaces();
  });
  return positions;
}

//동 정보 기반으로 데이터 추출하기
async function makeList(data) {
  let parser = new DOMParser();
  const xml = parser.parseFromString(data, "application/xml");

  //item부분 추출
  let apts = xml.querySelectorAll("item");
  console.log(apts);
  let sido = document.getElementById("sido").value;
  let dong = document.getElementById("dong").value;
  let year = document.getElementById("year").value;
  let month = document.getElementById("month").value;
  apts.forEach((apt) => {
    let curDongCode = apt.querySelector("법정동읍면동코드").textContent;
    let curYear = apt.querySelector("년").textContent;

    if (curDongCode == dong.substr(5)) {
      searchResult.push(apt);
    }
  });
}

//   function initTable() {
//     let tbody = document.querySelector("#aptlist");
//     let len = tbody.rows.length;
//     for (let i = len - 1; i >= 0; i--) {
//       tbody.deleteRow(i);
//     }
//   }

let btn = document.getElementById("aptBtn");
btn.addEventListener("click", startmap);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 마커를 담을 배열입니다
// var markers = [];

// var mapContainer = document.getElementById('map'), // 지도를 표시할 div
//     mapOption = {
//         center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };

// 지도를 생성합니다
// var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
// var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
// var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// 키워드로 장소를 검색합니다
// searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  var keyword = document.getElementById("keyword").value;
  let dongdong = searchResult[0].querySelector("법정동").textContent.substr(1);

  // if (!keyword.replace(/^\s+|\s+$/g, '')) {
  //     alert('키워드를 입력해주세요!');
  //     return false;
  // }
  if (keyword.replace(/^\s+|\s+$/g, "")) {
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    console.log(dongdong + " " + keyword);
    ps.keywordSearch(dongdong + " " + keyword, placesSearchCB);
  }
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}
