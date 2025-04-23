import pytest
import pymongo

from unittest.mock import patch
from src.util.dao import DAO



class TestDaoCreate:

    @pytest.fixture
    def sut_user(self):
        dao = DAO(collection_name="user", test_database=True)
        object = dao.create({"firstName": "Test", "lastName": "Testson", "email": "test@test.se"})
        try:
            yield dao
        finally:
            dao.drop()


    @pytest.fixture
    def sut_video(self):
        dao = DAO(collection_name="video", test_database=True)
        object = dao.create({"url": "https://url.com"})
        try:
            yield dao
        finally:
            dao.drop()


    def test_dao_create_invalid(self, sut_user):
        """
        Invalid format, required property lastName missing
        """
        with pytest.raises(pymongo.errors.WriteError):
            sut_user.create(
                {"firstName": "Test", "email": "test@test.se"}
            ) 

    def test_dao_create_valid_unique(self, sut_user):
        """
        Valid format and unique email address should return object
        """
        obj = sut_user.create(
                {"firstName": "Test", "lastName": "Testson", "email": "unique@test.se"}
            )
        
        assert isinstance(obj, dict)

    def test_dao_create_valid_not_unique(self, sut_user):
        """
        Valid format but not unique email address should raise WriteError
        """
        with pytest.raises(pymongo.errors.WriteError):
            sut_user.create(
                {"firstName": "Test", "lastName": "Testson", "email": "test@test.se"}
            )

    def test_dao_create_video_valid_not_unique(self, sut_video):
        """
        Valid format and not unique url should return object
        """
        obj = sut_video.create({"url": "https://url.com"})
        
        assert isinstance(obj, dict)