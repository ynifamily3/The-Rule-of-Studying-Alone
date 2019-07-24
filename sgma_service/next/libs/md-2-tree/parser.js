/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 임의의 정수를 반환한다.
*/
export function random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min + 0.5);
}

/*
      min ≤ x ≤ max, x ∈ Z를 만족하는 중복되지 않는
      n개의 서로 다른 x를 만들어서 반환한다.
      O(max - min)의 공간복잡도와 시간복잡도가 발생한다.
  */
export function random_choices(min, max, n) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let N = max - min + 1;
  if (N < n) {
    throw new Error(
      `[random_choice] Cannot choose ${n} different numbers between ${min} ~ ${max}`
    );
  }

  // min ~ max까지의 숫자를 만든다
  let out = [];
  for (let i = 0; i < N; ++i) out[i] = min + i;

  // 적당히 섞는다.
  shuffle(out);

  // n개만 반환한다.
  if (n == N) return out;
  else return out.slice(0, n);
}

/*
      arr를 무작위로 섞는다.
      outplace가 true이면 새 배열을 반환한다.
  */
export function shuffle(arr, outplace) {
  if (outplace) arr = arr.slice();
  let temp, idx1, idx2;
  for (let i = 0; i < arr.length; ++i) {
    idx1 = random_int(0, arr.length - 1);
    idx2 = random_int(0, arr.length - 1);
    temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  }
  return arr;
}

/*
      배열 arr에서 아무 원소나 반환한다.
  */
export function get_randomly(arr) {
  return arr[random_int(0, arr.length - 1)];
}

/*
      배열 arr에서 아무 원소를 n개 찍어서 반환한다.
  */
export function get_randomly_multi(arr, n) {
  return random_choices(0, arr.length - 1, n).map(idx => {
    return arr[idx];
  });
}

/*
      배열 arr에서 아무 원소를 n개 찍어서 반환한다.
      중복이 허용된다.
  */
export function get_randomly_multi_dup(arr, n) {
  let out = [];
  for (let i = 0; i < n; ++i) out[i] = get_randomly(arr);
  return out;
}
export class Group {
  /*
          String name: 주제의 이름
      */
  constructor(id, name) {
    console.assert(id !== undefined);
    console.assert(typeof name == "string");
    console.assert(name);
    this.name = name;
    this.childgroups = []; // GROUP REFERENCE
    this.infos = []; // INFO  REFERENCE
    this.id = id;
    this.comment = "";
  }
}

export class Info {
  /*
          String[] names: 지식의 이름, 반드시 1개 이상
          String[] attr: 지식의 속성, 반드시 1개 이상
      */
  constructor(id, names, attrs) {
    console.assert(id !== undefined);
    console.assert(names instanceof Array && names.length > 0);
    console.assert(attrs instanceof Array && attrs.length > 0);

    // names는 이 Info의 이름(들)을 String으로 저장한다.
    this.names = names;

    // attrs는 이 Info의 속성(들)을 String으로 저장한다.
    this.attrs = attrs;

    // groups는 이 Info가 소속된 주제(들)을 레퍼런스로 저장한다.
    this.basegroups = []; //
    this.id = id;
  }
}

export class Soup {
  constructor() {
    this.groups = [];
    this.infos = [];
    this.gcnt = 0;
    this.icnt = 0;
  }

  create_group(name) {
    let temp = new Group(this.gcnt++, name);
    this.groups.push(temp);
    return temp;
  }

  create_info(names, attrs) {
    let temp = new Info(this.icnt++, names, attrs);
    this.infos.push(temp);
    return temp;
  }

  // parent에 child를 직속주제 또는 직속지식으로 추가하고
  // true를 반환한다. 이미 소속이 돼 있는 경우 false를
  // 반환한다.
  append(parent, child) {
    if (child instanceof Group) this.__append_group(parent, child);
    else if (child instanceof Info) this.__append_info(parent, child);
    else throw new Error("child is neither Group or Info");
  }

  __append_group(parent, child) {
    // 하위 주제에서 상위 주제로 가는 경로가 있는지 검사한다.

    // 상위 주제가 하위 주제를 이미 포함하고 있는지 확인한다.
    if (parent.childgroups.indexOf(child) != -1) return false;

    parent.childgroups.push(child);
    return true;
  }

  __append_info(parent, info) {
    // 상위 주제가 이 지식을 이미 포함하고 있는지 확인한다.
    if (parent.infos.indexOf(info) != -1) return false;

    parent.infos.push(info);
    info.basegroups.push(parent);
    return true;
  }

  /*
          이 Group의 상태를 보여줄 수 있는 트리를 텍스트로 그린다.
          이 함수의 외부에서 사용 시 인자는 없다.
  
          엄밀하게는 이 DB는 DAG이지 Tree는 아니다.
          하지만 직관적으로 확인하기 위해 Tree로 간주하고 그린다.
      */
  get_tree() {
    function _getTreeText(node, out, tab) {
      out += `${tab}${node.name}\n`;
      tab += ". . ";
      node.infos.forEach(info => {
        out += `${tab}info[${info.id}] ${info.names[0]}\n`;
        info.attrs.forEach(attr => {
          out += `${tab} * ${attr}\n`;
        });
      });
      node.childgroups.forEach(child => {
        out = _getTreeText(child, out, tab);
      });

      return out;
    }
    return _getTreeText(this.groups[0], "", "");
  }
}

// 주제 g로부터 도달할 수 있는 모든 지식을 반환한다.
Soup.fetch_subinfos = function(g) {
  function __fetch_subinfos(node, out, dup) {
    console.assert(node instanceof Group);
    node.infos.forEach(info => {
      if (!dup[info.id]) {
        out.push(info);
        dup[info.id] = true;
      }
    });
    node.childgroups.forEach(child => {
      __fetch_subinfos(child, out, dup);
    });
    return out;
  }
  return __fetch_subinfos(g, [], {});
};

// 지식 material에서 임의의 속성을 선택한다.
Soup.select_positive_attr = function(material) {
  return get_randomly(material.attrs);
};

// 지식 material에서 겹치지않는 n개의 임의의 속성들을 선택한다
Soup.select_positive_attrs = function(material, n) {
  return get_randomly_multi(material.attrs, n);
};

// 지식들 subinfos에서 지식 material과 충돌하지 않는 속성을 선택한다.
// 원래 문서에는 매번 subinfos를 구하지만 이는 비효율적이므로, 외부에서
// 사전에 구하도록 한다.
//
// 현재는 material에 대하여 명제가 충돌하는지 검사할 방법이 없으므로
// 그냥 아무거나 잡는다.
Soup.select_negative_attr = function(material, subinfos) {
  return get_randomly(
    subinfos.reduce((accm, info) => {
      if (info == material) return accm;
      else return accm.concat(info.attrs);
      // else if(is_subject_to(info, material))
      // 	return accm.concat(info.attrs);
      // else
      // 	return accm;
    }, [])
  );
};

// select_negative_attr의 복수버전
Soup.select_negative_attrs = function(material, subinfos, n) {
  return get_randomly_multi(
    subinfos.reduce((accm, info) => {
      if (info == material) return accm;
      else return accm.concat(info.attrs);
      // else if(is_subject_to(info, material))
      // 	return accm.concat(info.attrs);
      // else
      // 	return accm;
    }, []),
    n
  );
};

/*
	이 코드의 내용은 abstraction.md를 잘 읽고 건드려야 한다.
*/
export function parse_doc(docstr) {
  // pre-process
  //console.log("function dcall");
  let sentences = extract_sentences(docstr);
  let tokens = reorganize(tokenize(sentences));
  let soup = cook(tokens);
  console.log(soup);
  return soup;
  //return soup.get_tree();
}

// 선두 공백문자(leading space)의 끝지점을 찾아 반환한다.
// ex: '  1234' -> 2
export function index_of_first_nonspace(target) {
  let result = target.match(/^( |'\t')*/);
  if (result) return result[0].length;
  else return 0;
}

// docstr에서 <문장>을 추출하여 배열로 반환한다.
export function extract_sentences(docstr) {
  return docstr
    .split("\n")
    .map(s => {
      // 문장 앞에 나오는 공백을 제거한다.
      // 제거할 필요가 없을 땐 복사를 막기 위해 원본을 반환한다.
      let sidx = index_of_first_nonspace(s);
      if (sidx == 0) return s;
      else return s.slice(sidx);
    })
    .filter(s => {
      // 공백 제거 후 내용이 없는 문장은 삭제한다.
      return s != "";
    });
}

// sentences 배열의 원소들을 다음과 같이 가공하여 배열로 반환한다.
// 	[식별 기호가 제외된 문장, 토큰 분류]
//
// 원소가 <제목n식별자>인 경우, 마지막에 추가로 n을 적어준다.
// ex: '#### 4개짜리' -> ['4개짜리', '<제목n>', 4]
//
// 식별 기호를 제거했을 때 내용이 없는 토큰은 삭제한다.
// ex: '* ' -> 삭제
export function tokenize(sentences) {
  return sentences
    .map(s => {
      let match_info = null;
      if ((match_info = s.match(/#+ /))) {
        // <제목n식별자>
        return [
          s.slice(match_info[0].length),
          "<제목n>",
          match_info[0].length - 1
        ];
      } else if ((match_info = s.match(/\* /))) {
        // <속성>
        return [s.slice(match_info[0].length), "<속성>"];
      } else {
        // <소주석>
        return [s, "<주석>"];
      }
    })
    .filter(token => {
      return token[0] != "";
    });
}

// 토큰열을 제목 서브토큰 주석 속성 순으로 만들어준다.
export function reorganize(tokens) {
  let stack = [];
  for (let i = tokens.length - 1; i >= 0; --i) {
    // 문서 상에서는 <소주석>과 <주석>을 이론적으로 구분하지만
    // 실제 코딩을 할 때는 구분이 필요없다.
    if (tokens[i][1] == "<주석>") {
      // 최초의 주석은 무시
      if (i == 0) break;

      if (tokens[i - 1][1] == "<주석>") {
        // 주석이 연달아 나오면 합친다.
        let merged = [];
        merged[0] = tokens[i - 1][0] + "\n" + tokens[i][0];
        merged[1] = "<주석>";
        tokens[i - 1] = merged;
      } else if (tokens[i - 1][1] == "<속성>") {
        // 속성이 앞에 있으면 자리를 바꾼다.
        let temp = tokens[i];
        tokens[i] = tokens[i - 1];
        tokens[i - 1] = temp;
        stack.push(tokens[i]);
      } else {
        // 일반적인 주석이다.
        stack.push(tokens[i]);
      }
    } else {
      stack.push(tokens[i]);
    }
  }
  return stack.reverse();
}

// 토큰을 분석하여 수프를 만들어 Group[]으로 반환한다.
// 문서에 따라서 트리가 아닌, 포레스트일 가능성이 있어 배열로 반환한다.
export function cook(tokens) {
  // 에러
  if (tokens == null) throw new Error("[parser::cook] null pointer exception");

  // 지저분한 예외
  if (tokens.length == 0) return [];

  // 전체가 예쁜 루트로 묶여있으면 참 좋은데
  // 사용자들이 그렇게 예쁘게 적어줄 리가 없다.
  //
  // 한 과목 내에 여러 문서 파일이 존재할 수가 있으며
  // 문서마다 임의로 주제를 만들어 묶을 경우, 무의미한 주제가 생긴다.
  //
  // 그래서 포레스트로 인정을 하며, 그걸 어떻게 다룰지는
  // cook을 호출한 곳의 상황에 따라 결정하록 한다
  let out = [];
  let spos = 0;
  let epos = 1;
  let level = tokens[0][2];
  while (epos <= tokens.length) {
    if (epos == tokens.length) {
      // 맨 마지막 경우
      let temp = assemble(tokens, spos, epos);
      if (temp) out.push(temp);
      spos = epos;
    } else if (tokens[epos][1] == "<제목n>" && tokens[epos][2] <= level) {
      // 현재 토큰의 뎁스보다 더 깊은 녀석은 자식이다
      level = tokens[epos][2];
      let temp = assemble(tokens, spos, epos);
      if (temp) out.push(temp);
      spos = epos;
    }
    ++epos;
  }
  return out;
}
let soup = new Soup();
let root = null;

// 전제조건: tokens[spos]는 반드시 <제목n>이어야 하며
// [spos, epos) 구간의 제목 단계는 n보다 커야한다.
export function assemble(tokens, spos, epos) {
  //let out = new Group(tokens[spos][0]);
  let out = soup.create_group(tokens[spos][0]);
  let attrs = [];
  ++spos;
  while (spos < epos) {
    if (tokens[spos][1] == "<주석>") {
      // 현재 토큰이 <주석>이면 현재 주제에 추가
      out.comment = tokens[spos][0];
      ++spos;
    } else if (tokens[spos][1] == "<속성>") {
      // 현재 토큰이 <속성>이면 나중에 같은 이름의 지식 만듦
      attrs.push(tokens[spos][0]);
      ++spos;
    } else if (tokens[spos][1] == "<제목n>") {
      // 현재 토큰이 <제목n>이면 자식을 만듦
      do {
        let idx = spos + 1;
        while (
          idx < tokens.length &&
          !(tokens[idx][1] == "<제목n>" && tokens[idx][2] <= tokens[spos][2])
        ) {
          ++idx;
        }
        let temp = assemble(tokens, spos, idx);
        if (temp) soup.append(out, temp);
        spos = idx;
      } while (spos < epos);
    }
  }

  if (attrs.length > 0) {
    // 속성이 있으면 그 주제와 같은 이름의 지식을 만들어서 추가
    soup.append(out, soup.create_info([out.name], attrs));
    return out;
  } else if (out.childgroups.length > 0) {
    // 자식주제가 있는 경우, 유의미한 주제임
    return out;
  } else {
    // 속성도 없고 자식주제도 없으면 무의미하므로 제거
    return null;
  }
}
/*
document.getElementById('docs').onchange = function(evt) {
	debug_parse_doc(evt.target.value);
};*/

export function debug_parse_doc(docstr) {
  // for debug purpose
  root = parse_doc(docstr)[0];
  return soup.get_tree();
}
