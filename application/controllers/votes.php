<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Votes extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/votes
	 *	- or -  
	 * 		http://example.com/index.php/votes/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/votes/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */

    public function __construct(){
        parent::__construct();
        $this->load->model('votes_model');
    }
	/*public function index()
	{
        $data = $this->votes_model->get_top_votes();

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
	}*/

    public function more_votes(){
        $data = $this->votes_model->get_more_votes();

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
    }

    public function submit_vote(){
        $id = $this->input->post('id');
        if($id){
            $this->votes_model->add_vote_existing($id);
        }else{
            $this->votes_model->add_vote_new($this->input->post());
        }

//        var_dump($this->input->post());
    }

    public function index($id=null){
        $requestMethod = $this->input->server('REQUEST_METHOD');

        switch($requestMethod){
            case 'PUT':
                $put = json_decode(stripslashes(file_get_contents('php://input')), true);
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode($this->votes_model->add_vote_existing($id)));
                break;
            case 'POST':
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode($this->votes_model->add_vote_new(json_decode($this->input->post('model')))));
                break;
            case 'GET':
                $data = $this->votes_model->get_votes();

                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode($data));
//                echo 'get';
                break;
            case 'DELETE':
//                $this->votes_model->add_vote();
                echo 'delete';
                break;
            case 'UPDATE':
//                $this->votes_model->add_vote();
                echo 'update';
                break;
            default:
                echo 'something else: ' . $this->input->server('REQUEST_METHOD');
                break;

        }
    }
}

/* End of file votes.php */
/* Location: ./application/controllers/votes.php */