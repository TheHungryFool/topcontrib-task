import React from 'react';
import swal from 'sweetalert';
import * as constants from './constants';
import config from './config.json';
import Repository from './Repository';
import './index.css';

class TopContrib extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showRepoSpinner: false
        };

        this.handleGo = this.handleGo.bind(this);
    }

    handleGo = (e) => {
        this.setState({
            showRepoSpinner: true,
            errorText      : null,
            repositories   : []
        });

        if (!this.isValidInput()) {
            this.setState({
                showRepoSpinner: false
            });

            return swal("Validation Error", "One or more invalid input fields found", "error");
        }

        this.fetchRepositories();
    };

    isValidInput = () => {
        return this.organizationInput.value.trim() && this.mInput.value.trim() && this.nInput.value.trim();
    };

    getRequestOptions = () => {
        let options                                 = {method: "GET", headers: {}};
        options.headers[constants.CLIENT_TOKEN_KEY] = config.clientToken;

        if (this.accessTokenInput.value.trim()) {
            options.headers[constants.GITHUB_TOKEN_KEY] = this.accessTokenInput.value.trim();
        }

        return options;
    };

    fetchRepositories = () => {
        let url = new URL(config.apiBaseUrl + "/topRepos/" + this.organizationInput.value.trim());
        url.searchParams.append("n", this.nInput.value);

        fetch(String(url), this.getRequestOptions())
            .then(response => response.json())
            .then((result) => {
                let errorText = constants.RESPONSE_CODE_ERROR_MAP[result.error] &&
                    constants.RESPONSE_CODE_ERROR_MAP[result.error].MESSAGE;
                this.setState({
                    errorText   : errorText,
                    repositories: result.data.repositories
                });
            })
            .catch((error) => {
                this.setState({
                    errorText: constants.ERRORS.GENERIC_ERROR.MESSAGE

                });
            })
            .finally(() => {
                this.setState({
                    showRepoSpinner: false
                });
            });
    };

    renderRepositories = () => {
        if (!this.state.repositories) {
            return [];
        }

        return this.state.repositories.map((details, index) => {
            return <Repository key={index} details={details} m={this.mInput.value}
                               requestOptions={this.getRequestOptions()}
                               organization={this.organizationInput.value.trim()}/>;
        });
    };

    render() {
        return (
            <div className="container">
                <div>
                    <form>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="organization">Organization</label>
                                <input type="text" className="form-control" id="organization" placeholder=""
                                       ref={ref => this.organizationInput = ref} required/>
                            </div>
                            <div className="col-md-2 mb-3">
                                <label htmlFor="n">(n)</label>
                                <input type="number" className="form-control" id="n" placeholder=""
                                       ref={ref => this.nInput = ref} required/>
                            </div>
                            <div className="col-md-2 mb-3">
                                <label htmlFor="m">(m)</label>
                                <input type="number" className="form-control" id="m" placeholder=""
                                       ref={ref => this.mInput = ref} required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="accessToken">Token</label>
                                <input type="text" className="form-control" id="accessToken" placeholder=""
                                       ref={ref => this.accessTokenInput = ref}/>
                            </div>
                            <div className="col-md-1 mb-3">
                                <label htmlFor="button" style={{opacity: "0"}}>.</label>
                                <button className="btn btn-primary btn-mb btn-block" type="button"
                                        onClick={this.handleGo}>Go
                                </button>
                            </div>
                        </div>
                        <hr className="mb-4"/>
                    </form>
                </div>

                {
                    this.state.showRepoSpinner &&
                    <div className="d-flex pt-5 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }

                {
                    this.state.repositories && this.state.repositories.length ?
                        <h4 className="mb-1 pt-3 text-muted"> Top repositories for
                                                              "{this.organizationInput.value.trim()}" </h4>
                        :
                        ""
                }

                {
                    this.renderRepositories()
                }

                {
                    this.state.errorText ?
                        <div>
                            <h6 className="mb-3 text-muted text-center"> {this.state.errorText} </h6>
                        </div>
                        :
                        ""
                }

                <footer className="my-5 pt-3 text-muted text-center text-small">
                    <p className="mb-1">Created by: Vignesh Bayari R. (+91 72597 62742) (vigneshbayari@outlook.com)</p>
                </footer>
            </div>
        );
    }
}

export default TopContrib;
