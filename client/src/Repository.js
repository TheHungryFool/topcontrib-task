import React from 'react';
import * as constants from './constants';
import config from './config.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faCode } from '@fortawesome/free-solid-svg-icons';
import './index.css';

class Repository extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSpinner   : true,
            details       : props.details,
            organization  : props.organization,
            m             : props.m,
            requestOptions: props.requestOptions
        };

        this.fetchContributors();
    }

    fetchContributors = () => {
        let url = new URL(config.apiBaseUrl + "/topcontributors/" + this.state.organization + "/" + this.state.details.name);
        url.searchParams.append("m", this.state.m);

        fetch(String(url), this.state.requestOptions)
            .then(response => response.json())
            .then((result) => {
                let errorText = constants.RESPONSE_CODE_ERROR_MAP[result.error] &&
                    constants.RESPONSE_CODE_ERROR_MAP[result.error].MESSAGE;
                this.setState({
                    errorText   : errorText,
                    contributors: result.data.contributors
                });
            }).catch((error) => {
                this.setState({
                    errorText: constants.ERRORS.GENERIC_ERROR.MESSAGE
                });
            })
            .finally(() => {
                this.setState({
                    showSpinner: false
                });
            });
    };

    renderContributors = () => {
        if (!this.state.contributors) {
            return [];
        }

        return this.state.contributors.map((contributor, index) => {
            return <tr key={index}>
                <th scope="row">{contributor.contributions}</th>
                <td>{contributor.login}</td>
                <td>{contributor.id}</td>
            </tr>;
        });
    };

    render() {
        return (
            <div>
                <h5 className="mb-2 pt-4"> {this.state.details.name} </h5>
                <h6 className="mb-3 text-muted">
                    <FontAwesomeIcon icon={faCodeBranch}/> {this.state.details.forks_count}
                </h6>

                {
                    this.state.showSpinner ?
                        <div className="d-flex pt-5 justify-content-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        :
                        <table className="table table-striped table-bordered no-side-border">
                            <thead>
                            <tr>
                                <th scope="col" style={{width: "30%"}}><FontAwesomeIcon icon={faCode}/></th>
                                <th scope="col" style={{width: "30%"}}>Login</th>
                                <th scope="col" style={{width: "30%"}}>GitHub Id</th>
                            </tr>
                            </thead>
                            <tbody>

                            {
                                this.renderContributors()
                            }

                            </tbody>
                        </table>
                }

                {
                    this.state.errorText ?
                        <div>
                            <h6 className="mb-3 text-muted"> {this.state.errorText} </h6>
                        </div>
                        :
                        ""
                }

            </div>
        );
    }
}

export default Repository;
