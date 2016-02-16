'use strict';

require('./index.styl')

//var Guid = require('node-uuid')
var sorty = require('sorty')
var React = require('react')
var ReactDOM = require('react-dom')
var DataGrid = require('./src')
var faker = window.faker = require('faker');
var preventDefault = require('./src/utils/preventDefault')

// console.log('x');
var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            // return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i + 1,
                // id: Guid.create(),
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past(),
                country  : faker.address.country(),
                city  : faker.address.city()
            })
        }

        cache[len] = arr

        return arr
    }
})()

var RELOAD = true

var columns = [
    { name: 'id', title: '#', width: 50},
    { name: 'country', width: 200},
    { name: 'city', width: 150 },
    { name: 'firstName' },
    { name: 'lastName'  },
    { name: 'email', width: 200 }
]

var ROW_HEIGHT = 31
var LEN = 2000
var SORT_INFO = [{name: 'country', dir: 'asc'}]//[ { name: 'id', dir: 'asc'} ]
var dataOrigin = null;
var data = dataOrigin = gen(LEN);

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.onColumnResize = this.onColumnResize.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleColumnOrderChange = this.handleColumnOrderChange.bind(this);
    }


    render() {
        return <DataGrid
            ref="dataGrid"
            idProperty='id'
            dataSource={data}
            sortInfo={SORT_INFO}
            columns={columns}
            style={{height: 400}}
            onFilter={this.handleFilter}
            onSortChange={this.handleSortChange}
            onColumnResize={this.onColumnResize}
            onColumnOrderChange={this.handleColumnOrderChange}
        />
    }

    handleFilter(column, value, allFilterValues){
        data = dataOrigin;

        //go over all filters and apply them
      	Object.keys(allFilterValues).forEach(function(name){
      		var columnFilter = (allFilterValues[name] + '').toUpperCase()

      		if (columnFilter == ''){
      			return
      		}

      		data = data.filter(function(item){
      		    if ((item[name] + '').toUpperCase().indexOf(columnFilter) === 0){
      		        return true
      		    }
      		})
      	})

  	    this.forceUpdate();
  	}

    handleSortChange(sortInfo) {
        SORT_INFO = sortInfo;
        data = sorty(SORT_INFO, data);
        this.forceUpdate();
    }

    onColumnResize(firstCol, firstSize, secondCol, secondSize) {
        firstCol.width = firstSize;
        this.forceUpdate();
    }

    handleColumnOrderChange(index, dropIndex){
  		var col = columns[index]
  		columns.splice(index, 1) //delete from index, 1 item
  		columns.splice(dropIndex, 0, col)
  		this.forceUpdate()
	   }
}

ReactDOM.render((
    <App />
), document.getElementById('content'))
