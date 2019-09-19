const Info = require('./info');
const Soup = require('./soup');

const Protocol = {
	// info의 하위지식을 comm에 직렬화한다.
	__pack(info, comm) {
		comm.idxmap[info.jsid] = comm.cnt++;
		comm.out.infos.push(info.toJSON());
		info.childs.forEach(child => {
			if(comm.idxmap[child.jsid] === undefined)
				Protocol.__pack(child, comm);
			comm.out.connections.push([
				comm.idxmap[info.jsid],
				comm.idxmap[child.jsid]
			]);
		});
	},

	// Info[] roots를 최상위 지식으로 삼는 스프를
	// TopologyMessage로 만들어 반환한다.
	// TopologyMessage의 형식은 다음과 같다.
	// {
	//		infos: [], connections: [], type: some string
	// }
	create_message(soup, type) {
		let comm = {
			idxmap: {},
			cnt: 0,
			out: {
				infos: [],
				connections: [],
				type
			}
		};
		soup.roots.forEach(root => {
			if(comm.idxmap[root.jsid] === undefined)
				Protocol.__pack(root, comm);
		});
		return comm.out;
	},

	/*
		TopologyMessage msg를 다시 Soup로 반환한다.
		서버에서 들어온 것을 조립해준다.
	*/
	parse_message(msg) {
		let soup = new Soup();
		msg.infos.forEach(pre_info => {
			soup.create_info(pre_info.names, pre_info.attrs).
				comment = pre_info.comment;
		});

		// Topology Reset
		msg.connections.forEach(pair => {
			soup.append(soup.infos[pair[0]], soup.infos[pair[1]]);
		});

		return soup;
	}
};

module.exports = Protocol;