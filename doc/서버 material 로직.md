```pseudocode
let huge_soup = new Soup();

function _GET_TOTAL_MATERIALS(dir):
	// 반환할 거
	let new_info = new Info([dir.name.toString()], [])

	// 이 폴더 밑의 폴더에 재귀적으로 호출
	foreach folder in dir:
		new_info.childs.push(_GET_TOTAL_MATERIALS(folder, new_info))
		
	// 이 폴더 밑의 파일들을 다 끌어옴
	foreach file in dir:
		new_info.childs = new_info.childs.concat(every Info in file.soup.roots)
	return new_info

huge_soup.childs.push(_GET_TOTAL_MATERIALS(given_directory_from_request))

Protocol.create_message(soup, 'response')
```

