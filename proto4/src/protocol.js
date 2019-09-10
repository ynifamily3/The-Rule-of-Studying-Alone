const Info = require('./info');

const Protocol = {
	// info의 하위지식을 comm에 직렬화한다.
	__pack(info, comm) {
		comm.idxmap[info.jsid] = comm.cnt++;
		comm.out.infos.push(info.toJSON());
		info.childs.forEach(child => {
			if(comm.idxmap[child.jsid] === undefined)
				Protocol.__pack(child, comm);
			if(comm.out.type == 'add') {
				comm.out.connections.push([
					comm.idxmap[info.jsid],
					comm.idxmap[child.jsid]
				]);
			}
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
	}
};

module.exports = Protocol;