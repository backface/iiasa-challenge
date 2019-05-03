import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import ModalImage from 'react-modal-image'
import { ReactBingmaps } from 'react-bingmaps';
import moment from 'moment'

import "./FotoQuestEval.css";

const BING_API_KEY="Al6mB3j0W2nI7FG1M-ZsCVBnLNE_ywdnPlp45dzw54oCb1gOlhb7kOmHykZI171Q";
const SOURCE_URI="https://api.myjson.com/bins/jpfmg"; // /data.json"
const TARGET_URI="https://demo0929535.mockable.io/evaluate";


class FotoQuestEval extends Component {

  constructor(props){
    super(props);
    this.state = {
      contributions: [],
      isLoading: true,
      error: null,
      sortAsc: true,
    };
  }


  async componentDidMount() {
    try {
      const response = await fetch(SOURCE_URI);
      const data = await response.json();
      this.setState({ contributions: data, isLoading: false });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message, isLoading: false });
    }
  }

/*
  promise style could read like this
  componentDidMount() {
    fetch(SOURCE_URI).then( (response) => {
        response.json().then( (data) => {
          this.setState({ contributions: data, isLoading: false });
        }
      );
    })
  }
*/

  toggleSort() {
    var order = !this.state.sortAsc;
    var newdata = [];

    if (order) {
      newdata = this.state.contributions.sort(
        function(a,b) { return a.id - b.id}
      );
    } else {
      newdata = this.state.contributions.sort(
        function(a,b) { return b.id - a.id}
      )
    };

    this.setState( {sortAsc:order} );
    this.setState( {contributions:newdata} );

    // a quick hack to trigger the lazyloader
    window.scroll(0,1);
    window.scroll(0,-1)
  }


  handleSubmit(event) {
    event.preventDefault();
    var form = event.target;

    if (form.checkValidity() === false) {
      alert("form is invalid");
    } else {
      var data = {};
      data['id'] = form.id.value;
      data['evaluation'] = form.evaluation.value;
      data['comment'] = form.comment.value;

      fetch(TARGET_URI, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then( (response) => {

        // TODO: check for success message ?!!
        console.log(response);
        if(response.ok) {
          this.setState( {
            contributions:this.state.contributions.filter(
              d => d.id !== data.id )
          });
        }
      });
    }
  }


  render() {

    var header = (
      <div className="header">
        <h2 className="title">FotoQuest Go Evaluator</h2>
        <div className="options">
          <button onClick={this.toggleSort.bind(this)} className="btn btn-outline">
            { this.state.sortAsc ? <i className="fa fa-sort-amount-asc"></i> : <i className="fa fa-sort-amount-desc"></i>}
          </button>
        </div>
      </div>
    )

    if (this.state.isLoading) {
      return (
        <div className="FQEval">
          {header}
          <div className="loading">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          </div>
        </div>
      )
    } else if (this.state.error) {
      return (
        <div className="FQEval">
          {header}
          Error fetching data <br />
          { this.state.error }
        </div>
      )
    }

    return (
      <div className="FQEval">
        {header}

        <div className="container-fluid">
          {
            this.state.contributions.map( (d,i) => (

              <div key={d.id} className="box">
                <div className="boxheader">
                  <div className="id">#{d.id} </div>
                  <div className="timestamp">{moment.utc(d.timestamp).format()}</div>
                  <div className="date">{ moment.utc(d.timestamp).fromNow()} </div>
                  <div className="platform">
                    {d.platform.device} {d.platform.osversion},
                    App {d.platform.App} {d.platform.appversion}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="row no-gutters">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                          <LazyLoad>
                            <ModalImage className="img-fluid"
                              small={d.photos.find( i => i.direction === "north").url}
                              large={d.photos.find( i => i.direction === "north").url}
                              alt="north"
                            />
                          </LazyLoad>
                        </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <LazyLoad>
                          <ModalImage className="img-fluid"
                            small={d.photos.find( i => i.direction === "west").url}
                            large={d.photos.find( i => i.direction === "west").url}
                            alt="west"
                          />
                        </LazyLoad>
                      </div>
                      <div className="col-md-4">
                        <LazyLoad>
                          <ModalImage className="img-fluid"
                            small={d.photos.find( i => i.direction === "ground").url}
                            large={d.photos.find( i => i.direction === "ground").url}
                            alt="ground"
                          />
                        </LazyLoad>
                      </div>
                      <div className="col-md-4">
                        <LazyLoad>
                          <ModalImage className="img-fluid"
                            small={d.photos.find( i => i.direction === "east").url}
                            large={d.photos.find( i => i.direction === "east").url}
                            alt="east"
                          />
                        </LazyLoad>
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-md-4"> </div>
                      <div className="col-md-4">
                      <LazyLoad>
                        <ModalImage className="img-fluid"
                          small={d.photos.find( i => i.direction === "south").url}
                          large={d.photos.find( i => i.direction === "south").url}
                          alt="south"
                        />
                      </LazyLoad>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row no-gutters">
                      <div className="location">
                        {d.location.lat}, {d.location.lon} | <i className="fa fa-map"></i> |
                          <a target="_new" href={ "https://www.google.com/maps/@"
                            + d.location.lat +"," + d.location.lon +",15z/data=!3m1!1e3"} > @google
                          </a> |
                          <a target="_new" href={ "https://www.bing.com/maps?cp="
                            + d.location.lat +"~" + d.location.lon +"&lvl=15&style=h"} > @bing
                          </a>
                        </div>
                    </div>
                    <div className="row no-gutters mapOuterContainer">
                      <div className="col mapContainer">
                        <LazyLoad>
                          <ReactBingmaps
                            id = {d.id}
                            className = "map"
                            mapTypeId = {"aerial"}
                            navigationBarMode = {"compact"}
                            zoom = {15}
                            pushPins = {
                              [
                                {
                                  "location": [parseFloat(d.location.lat), parseFloat(d.location.lon)],
                                  "option":{ color: 'red' }
                                },
                              ]
                            }
                            bingmapKey = {BING_API_KEY}
                            center = {[parseFloat(d.location.lat), parseFloat(d.location.lon)]}
                            >
                          </ReactBingmaps>
                        </LazyLoad>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="landobservations">
                  Observed as: <span className="data">{d.landobservations[0].landcover} / {d.landobservations[0].landuse} </span>
                </div>

                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input type="hidden" name="id" value={d.id} />
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group">
                        <label htmlFor="comment" className="form-label">&nbsp;</label>
                        <textarea placeholder="Leave a Comment for user" rows="3" id="comment" className="form-control"></textarea>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="evaluation" className="form-label">Evaluate as</label>
                        <select required id="evaluation" className="form-control">
                          <option value=""></option>
                          <option value="1">approved</option>
                          <option value="2">rejected because of photos </option>
                          <option value="3">rejected because of classifications</option>
                          <option value="4">rejected because of location</option>
                          <option value="9">rejected</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-dark">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            ))
          }

        </div>

        <button type="submit" className="btn btn-dark">Load More</button>

      </div>
    )
  }
}

export default (FotoQuestEval)
