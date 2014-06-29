<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Votes_model extends CI_Model {
    public function __construct(){
        parent::__construct();
    }

    public function get_votes(){
        $query = $this
            ->db
            ->order_by('votes', 'desc')
            ->get('route_votes');
        return $query->result_array();
    }


    public function get_top_votes(){
        $query = $this
            ->db
            ->order_by('votes', 'desc')
            ->limit(5)
            ->get('route_votes');
        return $query->result_array();
    }

    public function get_more_votes(){
        $query = $this
            ->db
            ->order_by('votes', 'desc')
            ->limit(100, 5)
            ->get('route_votes');
        return $query->result_array();
    }

    public function add_vote_existing($id){
        //increase value by 1
        $query = $this->db
            ->select('votes')
            ->where('id', $id)
            ->get('route_votes');

        $votes_arr = $query->result_array();

        if($votes_arr[0]['votes']){
            //insert votes +1
            $data = array(
                'votes' => $votes_arr[0]['votes'] + 1,
            );

            $this->db->where('id', $id);
            $this->db->update('route_votes', $data);
            return true;
        }else{
            return false;
        }
    }

    public function add_vote_new($vote){
        //insert new vote
        $data = array(
            'votes'     => 1,
            'city'      => $vote->city,
            'dest'      => $vote->dest,
        );

        $this->db->insert('route_votes', $data);
        $id =  $this->db->insert_id();
        $data['id'] = $id;
        return $data;
    }

}

/* End of file votes_model.php */
/* Location: ./application/controllers/votes_model.php */