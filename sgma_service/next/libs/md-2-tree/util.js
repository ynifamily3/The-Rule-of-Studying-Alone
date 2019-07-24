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
