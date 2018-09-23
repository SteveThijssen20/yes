#include <eosiolib/eosio.hpp>

using namespace eosio;
using namespace std;

class sc : public eosio::contract {
  public:
      sc(account_name s):contract(s)/*, _users(s, s)*/
      {}

      // public methods exposed via the ABI
      // on pollsTable

      [[eosio::action]]
      void create(string username, string firstname, string lastname, string email, string gender, string phone)
      {
          userstable _users(_self, _self);
          _users.emplace(_self, [&](auto& p)
                                {
                                    p.key = _users.available_primary_key();
                                    p.username = username;
                                    p.firstname = firstname;
                                    p.lastname = lastname;
                                    p.email = email;
                                    p.gender = gender;
                                    p.phone = phone;
                                });

        print(username, name{_self});
      };

  private:    

    //@abi table user i64
    struct [[eosio::table]] user 
    {
        uint64_t key;
        string username;
        string firstname;
        string lastname;
        string email;
        string gender;
        string phone;

        uint64_t primary_key() const { return key; }

        EOSLIB_SERIALIZE( user, (key)(username)(firstname)(lastname)(email)(gender)(email))
    };
    typedef eosio::multi_index<N(user), user> userstable;

    //userstable _users;
};

EOSIO_ABI( sc, (create))
