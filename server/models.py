from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_bcrypt import Bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates

from config import db

bcrypt = Bcrypt()

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    matcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    matchee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    accepted = db.Column(db.Integer, nullable=False)

    matcher_user = db.relationship('User',foreign_keys = [matcher_id],back_populates='likes')
    matchee_user = db.relationship('User',foreign_keys = [matchee_id],back_populates='likes')
    serialize_rules = ['-matcher_user','-matchee_user']

    def __repr__(self):
        return f'<Like id:{self.id}, matcher:{self.matcher_id}, matchee:{self.matchee_id},accepted:{self.accepted}>'


class Match(db.Model, SerializerMixin):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    matcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable= False)
    matchee_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)

    matcher_user = db.relationship('User',foreign_keys = [matcher_id],back_populates='matches')
    matchee_user = db.relationship('User',foreign_keys = [matchee_id],back_populates='matches')
    serialize_rules = ['-matcher_user','-matchee_user']

    def __repr__(self):
        return f'<Match id:{self.id}, matcher:{self.matcher_id}, matchee:{self.matchee_id}>'

class Preference(db.Model, SerializerMixin):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)
    pref_category = db.Column(db.String, nullable=False)
    pref_value = db.Column(db.String)

    user = db.relationship('User',back_populates='preferences')
    serialize_rules = ['-user.preferences']

    def __repr__(self):
        return f'<Preference id:{self.id}, user:{self.user_id}, pref_category:{self.pref_category}, pref_value:{self.pref_value}>'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String) #nullable = false???

    image = db.Column(db.String)
    bio = db.Column(db.String)
    date_matching = db.Column(db.Integer,default=0)

    preferences = db.relationship('Preference',back_populates='user')
    likes = db.relationship('Like',foreign_keys=[Like.matcher_id],back_populates='matcher_user')
    matches = db.relationship('Match',foreign_keys=[Match.matcher_id],back_populates='matcher_user')
    attributes = db.relationship('UserAttribute',back_populates='user')
    messages = db.relationship('Message',back_populates='user')
    serialize_rules = ['-_password_hash','-preferences.user','-likes.matcher_user','-matches.matcher_user','-attributes.user','-messages.user']

    matchee_likes = association_proxy('likes','matchee_user',creator=lambda matchee_user_obj: Like(matchee_user=matchee_user_obj))
    matchee_matches = association_proxy('matches','matchee_user',creator=lambda matchee_user_obj: Match(matchee_user=matchee_user_obj))

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User id:{self.id}, username:{self.username}>'

class PreferenceOption(db.Model, SerializerMixin):
    __tablename__= 'preference_options'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String, nullable=False)
    input_type = db.Column(db.String,nullable=False)
    options = db.Column(db.String)
    minval = db.Column(db.Integer)
    maxval = db.Column(db.Integer)
    icon = db.Column(db.String)

    def __repr(self):
        return f'<PreferenceOption id:{self.id}, category:{self.category}>'

class UserAttribute(db.Model, SerializerMixin):
    __tablename__= 'user_attributes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)
    attribute_category = db.Column(db.String, nullable=False)
    attribute_value = db.Column(db.String)

    user = db.relationship('User', back_populates='attributes')
    serialize_rules = ['-user']

    def __repr__(self):
        return f'<UserAttribute user_id:{self.user_id}, category:{self.attribute_category}, value: {self.attribute_value}>'

class Message(db.Model, SerializerMixin):
    __tablename__='messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    messagee = db.Column(db.Integer,nullable=False)
    message = db.Column(db.String)
    time = db.Column(db.String)

    def __repr__(self):
        return f'<Message user_id:{self.user_id}, messagee:{self.messagee}, message:{self.message}, time:{self.time}'

    user = db.relationship('User',back_populates='messages')
    serialize_rules = ['-user.messages']




