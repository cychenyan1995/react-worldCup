import React, { Component } from 'react';
import { Checkbox, Radio, Table, Badge, Dropdown, Icon, Menu, message } from 'antd';
import reqwest from 'reqwest';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/*const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];
*/


class App extends Component {

    state = {
        data: [],
        loading: false,
        lang: 0, //使用参数来控制数组下标,
        showRed: true,
        showYellow: true
    };

    fetch = () => {
        this.setState({ loading: true });
        reqwest({
            url: '/worldcup_2018.json',
            method: 'get',
            type: 'json',
        }).then((data) => {
            // Read total count from server
            // pagination.total = data.totalCount;
            this.setState({
                loading: false,
                data: data.results,
            });
        });
    }
    //组件加载完毕后执行
    componentDidMount() {
        this.fetch();
    }
    handleLangChanged = (e) => {
        this.setState({
            lang: e.target.value, //点击目标的value值
        })
    }
    handleShowRed = (e) => {
        this.setState({
            showRed: e.target.checked,
        })
    }
    handleShoeYellow = (e) => {
        this.setState({
            showYellow: e.target.checked,
        })
    }
    handleOperation = (type, matchId) => {//type类型判断
        let itemIndex = this.state.data.findIndex(x => x.matchId === matchId);//根据matchId找到对应的记录
        if (itemIndex !== -1) {
            // message.success(itemIndex)
            let currentMatch = this.state.data[itemIndex];
            let currentMatchHome = currentMatch.home[this.state.lang];
            let currentMatchGuest = currentMatch.guest[this.state.lang];
            let msg = '';
            switch (type) {
                case "homeScore":
                    currentMatch.homeScore++;
                    msg = <span><b className="text-danger">{currentMatchHome} {currentMatch.homeScore}</b> : {currentMatch.guestScore} {currentMatchGuest} </span>
                    message.success(msg, 10);
                    break;
                case "homeYellow":
                    currentMatch.homeYellow++;
                    break;
                case "homeRed":
                    currentMatch.homeRed++;
                    break;

                case "guestScore":
                    currentMatch.guestScore++;
                    msg = <span>{currentMatchHome} {currentMatch.homeScore}: <b className="text-danger">{currentMatch.guestScore} {currentMatchGuest}</b>  </span>
                    message.success(msg, 10);
                    break;
                case "guestYellow":
                    currentMatch.guestYellow++;
                    break;
                case "guestRed":
                    currentMatch.guestRed++;
                    break;
            }
            this.setState({
              //更新state
                data: this.state.data,
            })
        }
    }

    render() {
        const columns = [{
            title: '赛事',
            dataIndex: 'league',
            //key: 'league',
            render: league => <span>{league[this.state.lang]}</span>
        }, {
            title: '时间',
            dataIndex: 'matchTime',
            render: (value, record) => <span title={record.matchYear+"-"+record.matchDate+" "+record.matchTime}>{record.matchDate+" "+record.matchTime}</span>,
        }, {
            title: '住址',
            dataIndex: 'address',
        }, {
            title: '主队',
            dataIndex: 'home',
            render: (home, record) =>
                <div>
                <Badge className="mr-2" count={record.homeYellow} style={{ display:this.state.showYellow ? 'block' : 'none',borderRadius:0, backgroundColor: 'yellow', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                <Badge className="mr-2" count={record.homeRed} style={{ display:this.state.showRed ? 'block' : 'none',borderRadius:0, backgroundColor: 'red', color: '#fff', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                <span>{home[this.state.lang]}</span>
            </div>
        }, {
            title: '全场比分',
            dataIndex: 'score',
            render: (value, record) => <span>{record.homeScore} - {record.guestScore}</span>,
        }, {
            title: '客队',
            dataIndex: 'guest',
            render: (guest, record) =>
                <div>
               <span>{guest[this.state.lang]}</span>
                <Badge className="ml-2" count={record.guestYellow} style={{ display:this.state.showYellow ? 'block' : 'none',borderRadius:0, backgroundColor: 'yellow', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                <Badge className="ml-2" count={record.guestRed} style={{ display:this.state.showRed ? 'block' : 'none',borderRadius:0, backgroundColor: 'red', color: '#fff', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
            </div>
        }, {
            title: '半场比分',
            dataIndex: 'halfScore',
            render: (value, record) => <span>{record.homeHalfScore} - {record.guestHalfScore}</span>,
        }, {
            title: '本地模拟',
            dataIndex: 'operation',
            render: (value, record) =>
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item key="0">
                      <a onClick={e => this.handleOperation("homeScore",record.matchId)}>主队加1</a>
                    </Menu.Item>
                    <Menu.Item key="1">
                      <a onClick={e => this.handleOperation("homeYellow",record.matchId)}>主队黄牌加1</a>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <a onClick={e => this.handleOperation("homeRed",record.matchId)}>主队红牌加1</a>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <a onClick={e => this.handleOperation("guestScore",record.matchId)}>客队加1</a>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <a onClick={e => this.handleOperation("guestYellow",record.matchId)}>客队黄牌加1</a>
                    </Menu.Item>
                    <Menu.Item key="5">
                      <a onClick={e => this.handleOperation("guestRed",record.matchId)}>客队红牌加1</a>
                    </Menu.Item>

                    <Menu.Divider />
                  </Menu>
                } trigger={['click']}>
                  <a className="ant-dropdown-link" href="#">
                    模拟 <Icon type="down" />
                  </a>
                </Dropdown>,

        }];
        return (
            <div className="App">
         <nav className="navbar navbar-light bg-light">
           <div className="container">
              <a className="navbar-brand" href="/">World Cup 2018</a>
            </div>
          </nav>     

          <div className="container mt-3">
          <div className="filter my-3">
          <Checkbox checked={this.state.showRed} onChange={this.handleShowRed}>显示红牌</Checkbox>
            <Checkbox checked={this.state.showYellow} onChange={this.handleShoeYellow}>显示黄牌</Checkbox>
            <RadioGroup defaultValue={this.state.lang} onChange={this.handleLangChanged}>
              <RadioButton value={0}>简体</RadioButton>
              <RadioButton value={1}>繁体</RadioButton>
              <RadioButton value={2}>English</RadioButton>
            </RadioGroup>
          </div>
            
            <Table 
            dataSource={this.state.data} 
            columns={columns} 
            pagination={false} 
            size="middle"
            rowKey={record => record.matchId}
            loading={this.state.loading}
            />
          </div>
        
      </div>
        );
    }
}

export default App;